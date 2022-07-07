import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";
@Resolver(() => gql.Placement)
export class PlacementResolver {
  constructor(private readonly assetService: srv.AssetService) {}

  @ResolveField()
  async asset(@Parent() placement: gql.Placement) {
    return await this.assetService.load(placement.asset);
  }
}
