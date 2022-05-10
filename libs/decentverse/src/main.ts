import { INestApplication, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  DecentverseModule,
  DecentverseOptions,
} from "./lib/app/decentverse.module";
import { RedisIoAdapter } from "./lib/middlewares/redis-io.adapter";

export class Decentverse {
  app: INestApplication;
  options?: DecentverseOptions;
  constructor(options?: DecentverseOptions) {
    this.options = options;
  }
  async init() {
    this.app = await NestFactory.create(
      DecentverseModule.register(this.options)
    );
    const globalPrefix = "decentverse";
    this.app.setGlobalPrefix(globalPrefix);
    const redisIoAdapter = new RedisIoAdapter(this.app);
    await redisIoAdapter.connectToRedis();
    this.app.useWebSocketAdapter(redisIoAdapter);
    const port = process.env.PORT || 3333;
    await this.app.listen(port);
    Logger.log(`🚀 Decentverse is running on: ${await this.app.getUrl()}`);
  }
}
