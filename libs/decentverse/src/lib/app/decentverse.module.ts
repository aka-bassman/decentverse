import { Module, DynamicModule } from "@nestjs/common";
import { RtModule } from "./rt/rt.module";
import { AssetModule } from "./asset/asset.module";
import { AwsModule } from "./aws/aws.module";
import { FileModule } from "./file/file.module";

import { CharacterModule } from "./character/character.module";
import { MapModule } from "./map/map.module";
import { EventsModule } from "./events/events.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

export interface DecentverseOptions {
  objectStorage: {
    region: "ap-northeast-2";
    accessKey: string;
    secretAccessKey: string;
    distributionId: string;
  };
  mongo?: {
    uri: string;
    replSet?: string;
  };
  redis?: {
    url: string;
    username?: string;
    password?: string;
  };
}

@Module({})
export class DecentverseModule {
  static register(options: DecentverseOptions): DynamicModule {
    return {
      module: DecentverseModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: options?.mongo?.uri ?? "mongodb://localhost:27017",
            // uri: `mongodb://${config.get("DB_USER")}:${config.get(
            //   "DB_PASS"
            // )}@${config.get("DB_HOST")}`,
            // dbName: config.get("DB_NAME"),
            // authSource: "admin",
            // // // ...(connection === "replicaSet" ? { replicaSet } : {}),
            // ssl: false,
            // useNewUrlParser: true,
            // directConnection: true,
            // useUnifiedTopology: true,
            // readPreference: "primary",
            // connectTimeoutMS: 30000,
            // retryWrites: true,
          }),
          // inject: [],
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          imports: [ConfigModule],
          useFactory: async () => ({
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            sortSchema: true,
            playground: true,
            uploads: false,
            // ["development", "local.development"].includes(
            //   config.get("ENVIRONMENT")
            // ),
            debug: false,
          }),
          driver: ApolloDriver,
          // inject: [],
        }),
        EventsModule,
        AssetModule,
        CharacterModule,
        MapModule,
        AwsModule.register(options.objectStorage),
        FileModule,
        RtModule.register(options?.redis),
        ScheduleModule.forRoot(),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
