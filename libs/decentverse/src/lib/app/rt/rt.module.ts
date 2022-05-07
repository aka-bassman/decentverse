import { Global, Module, DynamicModule } from "@nestjs/common";
import { RtService } from "./rt.service";

export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}

@Global()
@Module({})
export class RtModule {
  static register(options?: RedisOptions): DynamicModule {
    return {
      module: RtModule,
      providers: [
        {
          provide: "REDIS_OPTIONS",
          useValue: options,
        },
        RtService,
      ],
      exports: [RtService],
    };
  }
}
