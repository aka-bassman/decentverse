import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}
@Injectable()
export class RtService implements OnModuleInit {
  private readonly logger = new Logger(RtService.name);
  options: RedisOptions;
  client: RedisClientType;
  constructor(private readonly configService: ConfigService) {
    this.options = {
      url: this.configService.get("REDIS_URL"),
      username: this.configService.get("REDIS_USERNAME"),
      password: this.configService.get("REDIS_PASSWORD"),
    };
    this.client = createClient(this.options);
    this.client.on("error", (err) =>
      this.logger.error("Redis Client Error", err)
    );
  }
  async onModuleInit() {
    await this.client.connect();
  }
}
