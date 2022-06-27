import { Global, Module } from "@nestjs/common";
import { PlacementResolver } from "./placement.resolver";
import { SpriteResolver } from "./sprite.resolver";
import { TileResolver } from "./tile.resolver";
import { AreaResolver } from "./area.resolver";
import { FlowResolver } from "./flow.resolver";
import { DialogueResolver } from "./dialogue.resolver";

@Global()
@Module({ providers: [PlacementResolver, SpriteResolver, TileResolver, AreaResolver, FlowResolver, DialogueResolver] })
export class ScalarModule {}
