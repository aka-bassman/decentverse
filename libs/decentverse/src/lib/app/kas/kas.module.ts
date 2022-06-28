import { DynamicModule, Global, Module } from "@nestjs/common";
import { KasResolver } from "./kas.resolver";
import { KasService, KlaytnOptions } from "./kas.service";

@Global()
@Module({})
export class KasModule {
  static register(options?: KlaytnOptions): DynamicModule {
    return {
      module: KasModule,
      providers: [
        {
          provide: "KLAYTN_OPTIONS",
          useValue: options,
        },
        KasService,
      ],
      exports: [KasService],
    };
  }
}
