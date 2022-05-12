import { Global, Module, DynamicModule } from "@nestjs/common";
import { AwsService } from "./aws.service";
export interface ObjectStorageOptions {
  region: string;
  accessKey: string;
  secretAccessKey: string;
  distributionId: string;
}
@Global()
@Module({})
export class AwsModule {
  static register(options?: ObjectStorageOptions): DynamicModule {
    return {
      module: AwsModule,
      providers: [
        {
          provide: "OBJECT_STORAGE_OPTIONS",
          useValue: options,
        },
        AwsService,
      ],
      exports: [AwsService],
    };
  }
}
