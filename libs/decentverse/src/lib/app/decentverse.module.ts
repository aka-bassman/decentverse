import { Module, DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as modules from "./module";
export interface DecentverseOptions {
  objectStorage: {
    region: "ap-northeast-2";
    accessKey: string;
    secretAccessKey: string;
    bucket: string;
    host?: string;
    distributionId: string;
  };
  mongo?: {
    uri: string;
    dbName: string;
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
            dbName: options?.mongo?.dbName ?? "test",
          }),
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
        modules.AdminModule,
        modules.EventsModule,
        modules.AssetModule,
        modules.CharacterModule,
        modules.MapModule,
        modules.AwsModule.register(options.objectStorage),
        modules.FileModule,
        modules.RtModule.register(options?.redis),
        modules.ScalarModule,
        modules.BatchModule,
        ScheduleModule.forRoot(),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
