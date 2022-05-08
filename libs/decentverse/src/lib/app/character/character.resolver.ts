import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CharacterService } from "./character.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class CharacterResolver {
  constructor(private readonly characterService: CharacterService) {}

  @Query(() => gql.Character)
  @UseGuards(Allow.Every)
  async character(
    @Args({ name: "characterId", type: () => String }) characterId: string
  ) {
    return this.characterService.character(characterId);
  }

  @Query(() => [gql.Character])
  @UseGuards(Allow.Every)
  async characters() {
    return this.characterService.characters();
  }

  @Mutation(() => gql.Character)
  @UseGuards(Allow.Admin)
  async createCharacter(@Args("data") data: gql.CharacterInput) {
    return await this.characterService.createCharacter(data);
  }

  @Mutation(() => gql.Character)
  @UseGuards(Allow.Admin)
  async updateCharacter(
    @Args({ name: "characterId", type: () => String }) characterId: string,
    @Args("data") data: gql.CharacterInput
  ) {
    return await this.characterService.updateCharacter(characterId, data);
  }

  @Mutation(() => gql.Character)
  @UseGuards(Allow.Admin)
  async removeCharacter(
    @Args({ name: "characterId", type: () => String }) characterId: string
  ) {
    return await this.characterService.removeCharacter(characterId);
  }
}
