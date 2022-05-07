import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MapService } from "./map.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../gql";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class MapResolver {
  constructor(private readonly mapService: MapService) {}

  @Query(() => gql.Map)
  @UseGuards(Allow.Every)
  async map(@Args({ name: "mapId", type: () => String }) mapId: string) {
    return this.mapService.map(mapId);
  }

  @Query(() => [gql.Map])
  @UseGuards(Allow.Admin)
  async maps() {
    return this.mapService.maps();
  }

  @Mutation(() => gql.Map)
  @UseGuards(Allow.Admin)
  async createMap(@Args("data") data: gql.MapInput) {
    return await this.mapService.createMap(data);
  }

  @Mutation(() => gql.Map)
  @UseGuards(Allow.Admin)
  async updateMap(
    @Args({ name: "mapId", type: () => String }) mapId: string,
    @Args("data") data: gql.MapInput
  ) {
    return await this.mapService.updateMap(mapId, data);
  }

  @Mutation(() => gql.Map)
  @UseGuards(Allow.Admin)
  async removeMap(@Args({ name: "mapId", type: () => String }) mapId: string) {
    return await this.mapService.removeMap(mapId);
  }
}
