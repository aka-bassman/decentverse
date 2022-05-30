import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";
@Resolver(() => gql.Sprite)
export class SpriteResolver {
  constructor(private readonly fileService: srv.FileService) {}
}
