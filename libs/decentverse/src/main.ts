import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DecentverseModule } from "./lib/app/decentverse.module";
import { RedisIoAdapter } from "./lib/middlewares/redis-io.adapter";
interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}
export class Decentverse {
  options?: RedisOptions;
  constructor(options?: RedisOptions) {
    this.options = options;
  }
  async init() {
    const app = await NestFactory.create(
      DecentverseModule.register(this.options)
    );
    const globalPrefix = "decentverse";
    app.setGlobalPrefix(globalPrefix);
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    const port = process.env.PORT || 3333;
    await app.listen(port);
    Logger.log(`🚀 Decentverse is running on: ${await app.getUrl()}`);
  }
}
