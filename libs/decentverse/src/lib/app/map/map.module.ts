import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Map from "./map.model";
import { MapService } from "./map.service";
import { MapResolver } from "./map.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Map.Map.name, useFactory: () => Map.schema }])],
  providers: [MapService, MapResolver],
  exports: [MapService],
})
export class MapModule {}
