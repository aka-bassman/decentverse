import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AssetService } from "./asset.service";
import { Allow, Account } from "~middlewares";
import { gql } from "~app";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}
  @Query(() => String)
  sayHello(): string {
    return "Hello World!";
  }

  @Query(() => gql.Asset)
  @UseGuards(Allow.Admin)
  async asset(@Args({ name: "assetId", type: () => String }) assetId: string) {
    return this.assetService.asset(assetId);
  }

  @Query(() => [gql.Asset])
  @UseGuards(Allow.Admin)
  async assets() {
    return this.assetService.assets();
  }

  @Mutation(() => gql.Asset)
  @UseGuards(Allow.Admin)
  async createAsset(@Args("data") data: gql.AssetInput) {
    return await this.assetService.createAsset(data);
  }

  @Mutation(() => gql.Asset)
  @UseGuards(Allow.Admin)
  async updateAsset(
    @Args({ name: "assetId", type: () => String }) assetId: string,
    @Args("data") data: gql.AssetInput
  ) {
    return await this.assetService.updateAsset(assetId, data);
  }

  @Mutation(() => gql.Asset)
  @UseGuards(Allow.SuperAdmin)
  async removeAsset(
    @Args({ name: "assetId", type: () => String }) assetId: string
  ) {
    return await this.assetService.removeAsset(assetId);
  }
}
