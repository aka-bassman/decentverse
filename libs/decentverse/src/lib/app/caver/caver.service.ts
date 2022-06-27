import { ConfigService } from "@nestjs/config";
// import * as Utils from "../../utils";
// import caverUtils from "../../caverUtils";
import { Injectable, Logger } from "@nestjs/common";
import * as dto from "./caver.dto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const KasCaver = require("caver-js-ext-kas");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js-latest");
import { KeyringContainer, default as CaverJs } from "caver-js-latest";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class CaverService {
  isActive = false;
  wallet: dto.WalletInfo;
  network: dto.NetworkInfo;
  caverWallet: KeyringContainer;
  caver: CaverJs;
  constructor(@InjectQueue("caver") private caverQueue: Queue, configService: ConfigService) {
    const klaytnEnv = configService.get("KLATYN_ENV") ?? "test";
    this.wallet = {
      address: configService.get("WALLET_ADDR"),
      privateKey: configService.get("WALLET_PRIVATE_KEY"),
    };
    this.network = {
      chainId: klaytnEnv === "production" ? "8217" : "1001",
      accessKeyId: configService.get("KLAYTN_ACCESS_KEY_ID"),
      secretAccessKey: configService.get("KLAYTN_SECRET_ACCESS_KEY"),
      preset: klaytnEnv === "production" ? 214 : 215,
    };
    const option = {
      headers: [
        {
          name: "Authorization",
          value: `Basic ${Buffer.from(`${this.network.accessKeyId}:${this.network.secretAccessKey}`).toString(
            "base64"
          )}`,
        },
        { name: "x-chain-id", value: this.network.chainId },
      ],
      keepAlive: false,
    };
    this.caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
    this.caverWallet = <KeyringContainer>this.caver.wallet;
    if (this.wallet.privateKey && this.wallet.privateKey !== "0x0") {
      const keyring = this.caverWallet.keyring.createFromPrivateKey(this.wallet.privateKey);
      this.caverWallet.add(keyring);
      this.isActive = true;
    }
    for (const i of [1, 2, 3, 4, 5]) {
      const privKey = configService.get(`TEST_REVEAL_WALLET_PRIVATE_KEY_${i}`);
      if (privKey) this.caverWallet.add(this.caverWallet.keyring.createFromPrivateKey(privKey));
    }
  }
  async addJob(req: dto.ContractExeutionRequest): Promise<boolean> {
    const job = this.caverQueue.add("executeContract", await this.executeContract(req));
    const res = (await job).finished();
    return res;
  }
  async executeContract(req: dto.ContractExeutionRequest): Promise<boolean> {
    const job = await this.caverQueue.add("executeContract", req);
    return new Promise((resolve, reject) => {
      this.caverQueue.on("completed", (j, status) => {
        j.id === job.id && resolve(status);
      });
    });
  }
}
