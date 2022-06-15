import { INestApplication, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DecentverseModule, DecentverseOptions } from "./lib/app/decentverse.module";
import { RedisIoAdapter } from "./lib/middlewares/redis-io.adapter";
import { graphqlUploadExpress } from "graphql-upload";

export class Decentverse {
  app: INestApplication;
  options?: DecentverseOptions;
  constructor(options?: DecentverseOptions) {
    this.options = options;
  }
  async init() {
    this.app = await NestFactory.create(DecentverseModule.register(this.options));
    const globalPrefix = "decentverse";
    this.app.setGlobalPrefix(globalPrefix);
    this.app.enableCors();
    const redisIoAdapter = new RedisIoAdapter(this.app);
    await redisIoAdapter.connectToRedis(this.options?.redis?.url);
    this.app.useWebSocketAdapter(redisIoAdapter);
    this.app.use(graphqlUploadExpress());
    const port = process.env.PORT || 3333;
    await this.app.listen(port);
    Logger.log(`🚀 Decentverse is running on: ${await this.app.getUrl()}`);
  }
}
