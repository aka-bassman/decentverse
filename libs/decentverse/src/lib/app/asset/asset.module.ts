import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Asset from "./asset.model";
import { AssetService } from "./asset.service";
import { AssetResolver } from "./asset.resolver";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.Asset.name, schema: Asset.schema },
    ]),
  ],
  providers: [AssetService, AssetResolver],
})
export class AssetModule {}
