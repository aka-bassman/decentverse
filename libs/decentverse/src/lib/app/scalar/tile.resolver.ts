import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";
@Resolver(() => gql.Tile)
export class TileResolver {
  constructor(private readonly fileService: srv.FileService) {}

  @ResolveField()
  async top(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.top);
  }
  @ResolveField()
  async bottom(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.bottom);
  }
  @ResolveField()
  async lighting(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.lighting);
  }
}
