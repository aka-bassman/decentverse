import { Global, Module, DynamicModule } from "@nestjs/common";
import { RtService, RedisOptions } from "./rt.service";

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
