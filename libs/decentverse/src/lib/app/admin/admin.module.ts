import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Admin from "./admin.model";
import { AdminService } from "./admin.service";
import { AdminResolver } from "./admin.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Admin.Admin.name, useFactory: () => Admin.schema }])],
  providers: [AdminService, AdminResolver],
  exports: [AdminService],
})
export class AdminModule {}
