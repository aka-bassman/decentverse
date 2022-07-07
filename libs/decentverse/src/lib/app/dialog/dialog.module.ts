import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Dialog from "./dialog.model";
import { DialogService } from "./dialog.service";
import { DialogResolver } from "./dialog.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Dialog.Dialog.name, useFactory: () => Dialog.schema }])],
  providers: [DialogService, DialogResolver],
  exports: [DialogService],
})
export class DialogModule {}
