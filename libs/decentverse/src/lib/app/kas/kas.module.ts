import { Global, Module } from "@nestjs/common";
import { KasService } from "./kas.service";

@Global()
@Module({
  providers: [KasService],
  exports: [KasService],
})
export class KasModule {}
