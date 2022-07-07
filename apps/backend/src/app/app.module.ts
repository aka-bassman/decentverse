import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
// import * as modules from "./modules";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.SERVICE_ENV === "script"
          ? `../.${process.env.ENVIRONMENT ?? ""}.env`
          : process.env.SERVICE_ENV === "serve"
          ? `apps/backend/.${process.env.ENVIRONMENT ?? ""}.env`
          : `${__dirname}/.${process.env.ENVIRONMENT ?? ""}.env`,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
