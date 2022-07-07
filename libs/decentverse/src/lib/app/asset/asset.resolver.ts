import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { AssetService } from "./asset.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../app/gql";
import { UseGuards } from "@nestjs/common";
import * as db from "../db";
import * as srv from "../srv";
@Resolver(() => gql.Asset)
export class AssetResolver {
  constructor(private readonly assetService: AssetService, private readonly fileService: srv.FileService) {}
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
  // @UseGuards(Allow.Admin)
  @UseGuards(Allow.Every) //! TODO
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
  async removeAsset(@Args({ name: "assetId", type: () => String }) assetId: string) {
    return await this.assetService.removeAsset(assetId);
  }

  // * Resolve Fields
  @ResolveField()
  async top(@Parent() asset: db.Asset.Asset) {
    return await this.fileService.load(asset.top);
  }
  @ResolveField()
  async bottom(@Parent() asset: db.Asset.Asset) {
    return await this.fileService.load(asset.bottom);
  }
  @ResolveField()
  async lighting(@Parent() asset: db.Asset.Asset) {
    return await this.fileService.load(asset.lighting);
  }
}
