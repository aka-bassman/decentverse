import { Module, DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as modules from "./module";
import { RedisOptions } from "./rt/rt.service";
import { KlaytnOptions } from "./kas/kas.service";
import { ObjectStorageOptions } from "./aws/aws.service";
export interface MongoOptions {
  uri: string;
  dbName: string;
  replSet?: string;
}
export interface DecentverseOptions {
  objectStorage: ObjectStorageOptions;
  mongo?: MongoOptions;
  redis?: RedisOptions;
  klaytn?: KlaytnOptions;
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
            debug: false,
          }),
          driver: ApolloDriver,
        }),
        modules.AdminModule,
        modules.UserModule,
        modules.EventsModule,
        modules.AssetModule,
        modules.CharacterModule,
        modules.MapModule,
        modules.RoleModule,
        modules.AwsModule.register(options.objectStorage),
        modules.FileModule,
        modules.DialogModule,
        modules.RtModule.register(options?.redis),
        modules.ScalarModule,
        modules.BatchModule,
        ...(options?.klaytn
          ? [modules.KasModule.register(options?.klaytn), modules.CaverModule.register(options?.redis, options?.klaytn)]
          : []),
        ScheduleModule.forRoot(),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
