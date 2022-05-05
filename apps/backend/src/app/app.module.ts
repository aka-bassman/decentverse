import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { app } from "@decentverse/server";
import { ScheduleModule } from "@nestjs/schedule";
import * as modules from "./modules";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.SERVICE_ENV === "serve"
          ? `apps/backend/.${process.env.ENVIRONMENT ?? ""}.env`
          : `${__dirname}/.${process.env.ENVIRONMENT ?? ""}.env`,
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => ({
    //     uri: `mongodb://${config.get("DB_USER")}:${config.get(
    //       "DB_PASS"
    //     )}@${config.get("DB_HOST")}`,
    //     dbName: config.get("DB_NAME"),
    //     authSource: "admin",
    //     // // ...(connection === "replicaSet" ? { replicaSet } : {}),
    //     ssl: false,
    //     useNewUrlParser: true,
    //     directConnection: true,
    //     useUnifiedTopology: true,
    //     readPreference: "primary",
    //     connectTimeoutMS: 30000,
    //     retryWrites: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => ({
    //     autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    //     sortSchema: true,
    //     playground: ["development", "local.development"].includes(
    //       config.get("ENVIRONMENT")
    //     ),
    //     debug: false,
    //   }),
    //   driver: ApolloDriver,
    //   inject: [ConfigService],
    // }),
    ScheduleModule.forRoot(),
    app.AwsModule,
    modules.RtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
