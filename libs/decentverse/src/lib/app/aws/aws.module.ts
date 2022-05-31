import { Global, Module, DynamicModule } from "@nestjs/common";
import { AwsService, ObjectStorageOptions } from "./aws.service";
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
