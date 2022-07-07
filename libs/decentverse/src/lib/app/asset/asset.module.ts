import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Asset from "./asset.model";
import { AssetService } from "./asset.service";
import { AssetResolver } from "./asset.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Asset.Asset.name, useFactory: () => Asset.schema }])],
  providers: [AssetService, AssetResolver],
  exports: [AssetService],
})
export class AssetModule {}
