import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";
import * as dto from "./rt.dto";
export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}
@Injectable()
export class RtService implements OnModuleInit {
  private readonly logger = new Logger(RtService.name);
  private readonly rootKeys = ["world", "players"] as const;
  maxDigits = 13;
  client: RedisClientType;
  constructor(@Inject("REDIS_OPTIONS") private options) {
    this.client = createClient(this.options);
    this.client.on("error", (err) => this.logger.error("Redis Client Error", err));
  }
  async onModuleInit() {
    await this.client.connect();
  }
  async init() {
    await Promise.all(this.rootKeys.map(async (key) => await this.client.del(key)));
  }
  async updatePlayer(id: string, score: string, data: string) {
    console.log(score, data);
    await Promise.all([
      this.client.hSet("players", id, data),
      this.client.zAdd("lastConnected", { score: new Date().getTime(), value: id }),
      this.client.zAdd("world", { score: <any>score, value: id }),
    ]);
  }
  async expirePlayers(expireSeconds = 5) {
    const time = new Date();
    time.setSeconds(time.getSeconds() - expireSeconds);
    const playerIds = await this.client.zRange("lastConnected", 0, time.getTime(), { BY: "SCORE" });
    return await this.removePlayers(playerIds);
  }
  async removePlayers(playerIds: string | string[]) {
    if (!playerIds.length) return 0;
    await Promise.all([
      this.client.hDel("players", playerIds),
      this.client.zRem("world", playerIds),
      this.client.zRem("lastConnected", playerIds),
      this.client.hDel("characters", playerIds),
    ]);
    return playerIds.length;
  }
  async getRange(min: string, max: string) {
    const res = await this.client.zRange("world", min, max, {
      BY: "SCORE",
    });
    return res.length ? await this.client.hmGet("players", res) : [];
  }
  async registerCharacter(id: string, data: string) {
    await this.client.hSet("characters", id, data);
    return true;
  }
  async characters(ids: string[]) {
    return ids.length ? await this.client.hmGet("characters", ids) : [];
  }
  convToScore(x: number, y: number, maxDigits: number) {
    const base = new Array(maxDigits).fill("0").join("");
    const [xbin, ybin] = [x.toString(2), y.toString(2)];
    const [xstr, ystr] = [base.substring(xbin.length) + xbin, base.substring(ybin.length) + ybin];
    return new Array(maxDigits)
      .fill(0)
      .map((_, idx) => xstr[idx] + ystr[idx])
      .join("");
  }
}
