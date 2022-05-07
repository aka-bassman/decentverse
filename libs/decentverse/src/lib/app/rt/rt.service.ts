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
    this.client.on("error", (err) =>
      this.logger.error("Redis Client Error", err)
    );
  }
  async onModuleInit() {
    await this.client.connect();
  }
  async init() {
    await Promise.all(
      this.rootKeys.map(async (key) => await this.client.del(key))
    );
  }
  async addPlayers(player: dto.Player) {
    await Promise.all([
      this.client.hSet("players", player.id, player.data),
      this.client.zAdd("world", {
        score: player.score,
        value: player.data,
      }),
    ]);
  }
  async removePlayer(playerId: string) {
    await Promise.all([
      this.client.zRem("world", playerId),
      this.client.hDel("players", playerId),
    ]);
  }
  async getRange(min: number, max: number) {
    const res = await this.client.zRange("world", min, max, {
      BY: "SCORE",
    });
    return res.length ? await this.client.hmGet("character", res) : [];
  }
  convToScore(x: number, y: number, maxDigits: number) {
    const base = new Array(maxDigits).fill("0").join("");
    const [xbin, ybin] = [x.toString(2), y.toString(2)];
    const [xstr, ystr] = [
      base.substring(xbin.length) + xbin,
      base.substring(ybin.length) + ybin,
    ];
    return new Array(maxDigits)
      .fill(0)
      .map((_, idx) => xstr[idx] + ystr[idx])
      .join("");
  }
}
