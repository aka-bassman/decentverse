import { ConfigService } from "@nestjs/config";
import { Injectable, Logger, Inject } from "@nestjs/common";
import * as dto from "./caver.dto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const KasCaver = require("caver-js-ext-kas");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js-latest");
import { KeyringContainer, default as CaverJs } from "caver-js-latest";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { KlaytnOptions } from "../kas/kas.service";
@Injectable()
export class CaverService {
  isActive = false;
  wallet: dto.WalletInfo;
  network: dto.NetworkInfo;
  caverWallet: KeyringContainer;
  caver: CaverJs;
  constructor(
    @Inject("KLAYTN_OPTIONS") private options: KlaytnOptions,
    @InjectQueue("caver") private caverQueue: Queue
  ) {
    this.wallet = {
      address: this.options.address,
      privateKey: this.options.privateKey,
    };
    this.network = {
      chainId: this.options.chainId,
      accessKeyId: this.options.accessKeyId,
      secretAccessKey: this.options.secretAccessKey,
      preset: this.options.chainId === "8217" ? 214 : 215,
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
