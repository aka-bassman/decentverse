import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";
@Resolver(() => gql.Sprite)
export class SpriteResolver {
  constructor(private readonly fileService: srv.FileService) {}

  @ResolveField()
  async idle(@Parent() sprite: gql.Sprite) {
    return await this.fileService.load(sprite.idle);
  }
  @ResolveField()
  async walk(@Parent() sprite: gql.Sprite) {
    return await this.fileService.load(sprite.walk);
  }
}
