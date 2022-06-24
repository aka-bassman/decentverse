import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from "@nestjs/graphql";
import { DialogService } from "./dialog.service";
import { Dialog } from "./dialog.gql";
import { Allow, Account } from "../../middlewares";
import * as gql from "../gql";
import * as srv from "../srv";
import * as db from "../db";
import { UseGuards } from "@nestjs/common";

@Resolver(() => Dialog)
export class DialogResolver {
  constructor(private readonly dialogService: DialogService, private readonly characterService: srv.CharacterService) {}
  @Query(() => gql.Dialog)
  @UseGuards(Allow.Admin)
  async dialog(@Args({ name: "dialogId", type: () => ID }) dialogId: string) {
    return this.dialogService.dialog(dialogId);
  }

  @Query(() => [gql.Dialog])
  @UseGuards(Allow.SuperAdmin)
  async dialogs() {
    return this.dialogService.dialogs();
  }

  @Mutation(() => gql.Dialog)
  @UseGuards(Allow.SuperAdmin)
  async createDialog(@Args("data") data: gql.DialogInput) {
    return await this.dialogService.createDialog(data);
  }

  @Mutation(() => gql.Dialog)
  @UseGuards(Allow.SuperAdmin)
  async updateDialog(
    @Args({ name: "dialogId", type: () => String }) dialogId: string,
    @Args("data") data: gql.DialogInput
  ) {
    return await this.dialogService.updateDialog(dialogId, data);
  }

  @Mutation(() => gql.Dialog)
  @UseGuards(Allow.SuperAdmin)
  async removeDialog(@Args({ name: "dialogId", type: () => String }) dialogId: string) {
    return await this.dialogService.removeDialog(dialogId);
  }

  @ResolveField(() => [gql.Character])
  async characters(@Parent() dialog: db.Dialog.Dialog) {
    return await this.characterService.loadMany(dialog.characters);
  }
}
