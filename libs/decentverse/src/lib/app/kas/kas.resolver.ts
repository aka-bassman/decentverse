import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { KasService } from "./kas.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../app/gql";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class KasResolver {
  constructor(private readonly kasService: KasService) {}
  @Query(() => [Int])
  // @UseGuards(Allow.Admin)
  async getUserTokenList(
    @Args({ name: "contract", type: () => String }) contract: string,
    @Args({ name: "address", type: () => String }) address: string
  ) {
    return (await this.kasService.getUserTokenList(address, contract)).map((token) => token.tokenId);
  }
}
