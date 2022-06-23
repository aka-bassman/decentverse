import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";

@Resolver(() => gql.Flow)
export class FlowResolver {
  constructor(private readonly characterService: srv.CharacterService, private readonly fileService: srv.FileService) {}

  @ResolveField()
  async image(@Parent() flow: gql.Flow) {
    return await this.fileService.load(flow.image);
  }

  @ResolveField()
  async background(@Parent() flow: gql.Flow) {
    return await this.fileService.load(flow.image);
  }
}
