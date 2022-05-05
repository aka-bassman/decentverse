import { Global, Module } from "@nestjs/common";
import { RtService } from "./rt.service";

@Global()
@Module({
  providers: [RtService],
})
export class RtModule {}
