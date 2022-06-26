import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../../app/gql";
import * as srv from "../srv";

@Resolver(() => gql.Dialogue)
export class DialogueResolver {
  constructor(private readonly dialogService: srv.DialogService) {}

  @ResolveField()
  async map(@Parent() dialogue: gql.Dialogue) {
    return await this.dialogService.load(dialogue.dialog);
  }
}
