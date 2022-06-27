import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js-ext-kas");
import * as Utils from "../../utils";
import { Injectable, Logger } from "@nestjs/common";
import * as dto from "./kas.dto";
import { WalletInfo, NetworkInfo } from "../caver/caver.dto";
@Injectable()
export class KasService {
  isActive = false;
  wallet: WalletInfo;
  network: NetworkInfo;
  keyring: any;
  caver: any;
  constructor(configService: ConfigService) {
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
    this.caver = new Caver(this.network.chainId, this.network.accessKeyId, this.network.secretAccessKey);
    if (this.wallet.privateKey && this.wallet.privateKey !== "0x0") {
      const keyringContainer = new this.caver.keyringContainer();
      this.keyring = keyringContainer.keyring.createFromPrivateKey(this.wallet.privateKey);
      keyringContainer.add(this.keyring);
      this.isActive = true;
    }
  }
  async getTokenList(contractAddress: string): Promise<dto.Token[]> {
    let res: dto.TokenListResponse = { items: [], cursor: "" };
    do {
      try {
        const query = { size: 1000, cursor: res.cursor };
        const ret = await this.caver.kas.tokenHistory.getNFTList(contractAddress, query);
        res = { items: [...res.items, ...ret.items], cursor: ret.cursor };
      } catch (err) {
        Logger.error("klaytn error :", err._message);
      }
    } while (res.cursor !== "" && res.cursor);
    return res.items.map((tokenItem) => this.translateToToken(tokenItem));
  }
  async getUserTokenList(address: string, contractAddress: string): Promise<dto.Token[]> {
    let res: dto.TokenListResponse = { items: [], cursor: "" };
    do {
      try {
        const query = {
          size: 1000,
          cursor: res.cursor,
        };
        const result = await this.caver.kas.tokenHistory.getNFTListByOwner(contractAddress, address, query);
        res = { items: [...res.items, ...result.items], cursor: result.items.cursor };
        console.log(res.items.length);
      } catch (err) {
        Logger.error("klaytn error :", err);
      }
    } while (res.cursor !== "" && res.cursor);
    return res.items.map((tokenItem) => this.translateToToken(tokenItem));
  }
  translateToToken(tokenItem: dto.TokenItem) {
    return {
      owner: tokenItem.owner,
      previousOwner: tokenItem.previousOwner,
      tokenId: parseInt(tokenItem.tokenId),
      url: tokenItem.tokenUri,
      txHash: tokenItem.transactionHash,
      createdAt: new Date(tokenItem.createdAt * 1000),
      updatedAt: new Date(tokenItem.updatedAt * 1000),
    };
  }
}
