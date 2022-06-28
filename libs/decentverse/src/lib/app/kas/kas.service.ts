// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js-ext-kas");
import * as Utils from "../../utils";
import { Inject, Injectable, Logger } from "@nestjs/common";
import * as dto from "./kas.dto";
import { WalletInfo, NetworkInfo } from "../caver/caver.dto";
import NewCaver from "caver-js-latest";

export interface KlaytnOptions {
  address: string;
  privateKey: string;
  chainId: string;
  accessKeyId: string;
  secretAccessKey: string;
}
@Injectable()
export class KasService {
  isActive = false;
  wallet: WalletInfo;
  network: NetworkInfo;
  keyring: any;
  caver: any;
  constructor(@Inject("KLAYTN_OPTIONS") private options: KlaytnOptions) {
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
      } catch (err) {
        Logger.error("klaytn error :", err);
      }
    } while (res.cursor !== "" && res.cursor);
    return res.items.map((tokenItem) => this.translateToToken(tokenItem));
  }
  async getOwnershipHistory(contractAddr: string, tokenId: number): Promise<dto.NFTOwnershipChangeResponse[]> {
    try {
      const result = await this.caver.kas.tokenHistory.getNFTOwnershipHistory(contractAddr, tokenId);
      return result.items;
    } catch (err) {
      console.log(err);
      return [];
    }
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
