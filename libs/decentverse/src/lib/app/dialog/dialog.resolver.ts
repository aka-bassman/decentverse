import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { DialogService } from "./dialog.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../app/gql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Dialog)
export class DialogResolver {
  constructor(private readonly dialogService: DialogService) {}
  @Query(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async dialog(@Args({ name: "roldId", type: () => ID }) dialogId: string) {
    return this.dialogService.dialog(dialogId);
  }

  @Query(() => [gql.Admin])
  @UseGuards(Allow.SuperAdmin)
  async dialogs() {
    return this.dialogService.dialogs();
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async createDialog(@Args("data") data: gql.DialogInput) {
    return await this.dialogService.createDialog(data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async updateDialog(
    @Args({ name: "dialogId", type: () => String }) dialogId: string,
    @Args("data") data: gql.DialogInput
  ) {
    return await this.dialogService.updateDialog(dialogId, data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async removeDialog(@Args({ name: "dialogId", type: () => String }) dialogId: string) {
    return await this.dialogService.removeDialog(dialogId);
  }
}
