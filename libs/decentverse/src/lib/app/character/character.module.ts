import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Character from "./character.model";
import { CharacterService } from "./character.service";
import { CharacterResolver } from "./character.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Character.Character.name, schema: Character.schema }])],
  providers: [CharacterService, CharacterResolver],
  exports: [CharacterService],
})
export class CharacterModule {}
