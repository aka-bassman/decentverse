import { Global, Module } from "@nestjs/common";
import { PlacementResolver } from "./placement.resolver";
import { SpriteResolver } from "./sprite.resolver";
import { TileResolver } from "./tile.resolver";

@Global()
@Module({
  providers: [PlacementResolver, SpriteResolver, TileResolver],
})
export class ScalarModule {}
