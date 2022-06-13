import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as User from "./user.model";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: User.User.name, schema: User.schema }])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
