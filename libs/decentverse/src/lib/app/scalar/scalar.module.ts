import { Global, Module } from "@nestjs/common";
import { PlacementResolver } from "./placement.resolver";
import { SpriteResolver } from "./sprite.resolver";
import { TileResolver } from "./tile.resolver";
import { AreaResolver } from "./area.resolver";

@Global()
@Module({ providers: [PlacementResolver, SpriteResolver, TileResolver, AreaResolver] })
export class ScalarModule {}
