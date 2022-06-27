import { Global, Module } from "@nestjs/common";
import { CaverService } from "./caver.service";
import { CaverConsumer } from "./caver.consumer";
import { BullModule } from "@nestjs/bull";

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: "caver",
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],

  providers: [CaverService, CaverConsumer],
  exports: [CaverService],
})
export class CaverModule {}
