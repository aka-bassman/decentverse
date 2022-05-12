import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as File from "./file.model";
import { FileService } from "./file.service";
import { FileResolver } from "./file.resolver";
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: File.File.name, schema: File.schema }])],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
