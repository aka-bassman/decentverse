import { Module, DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as module from "./module";
export interface DecentverseOptions {
  objectStorage: {
    region: "ap-northeast-2";
    accessKey: string;
    secretAccessKey: string;
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
        module.EventsModule,
        module.AssetModule,
        module.CharacterModule,
        module.MapModule,
        module.AwsModule.register(options.objectStorage),
        module.FileModule,
        module.RtModule.register(options?.redis),
        module.ScalarModule,
        module.BatchModule,
        ScheduleModule.forRoot(),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
