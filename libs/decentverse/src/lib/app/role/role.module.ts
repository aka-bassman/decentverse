import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Role from "./role.model";
import { RoleService } from "./role.service";
import { RoleResolver } from "./role.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Role.Role.name, schema: Role.schema }])],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}
