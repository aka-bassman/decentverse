import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import * as srv from "../srv";
@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);
  constructor(private readonly rtService: srv.RtService) {}
  @Cron("*/2 * * * * *")
  async takeSnapshot() {
    const expireNum = await this.rtService.expirePlayers();
    if (expireNum) this.logger.log(`${expireNum} Players Expired`);
  }
  //   @Interval(10000)
  //   handleInterval() {
  //     this.logger.debug("Called every 10 seconds");
  //   }

  //   @Timeout(5000)
  //   handleTimeout() {
  //     this.logger.debug("Called once after 5 seconds");
  //   }
}
