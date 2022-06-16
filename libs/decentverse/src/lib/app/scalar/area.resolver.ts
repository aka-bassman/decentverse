import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";

@Resolver(() => gql.Area)
export class AreaResolver {
  constructor(private readonly mapService: srv.MapService) {}

  @ResolveField()
  async map(@Parent() area: gql.Area) {
    return await this.mapService.load(area.map);
  }
}
