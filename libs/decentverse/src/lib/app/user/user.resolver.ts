import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => gql.User)
  @UseGuards(Allow.Every)
  async whoAmI(
    @Args({ name: "address", type: () => String }) address: string,
    @Args({ name: "message", type: () => String }) message: string,
    @Args({ name: "signAddress", type: () => String }) signAddress: string
  ) {
    return await this.userService.whoAmI(address, message, signAddress);
  }

  @Mutation(() => gql.User)
  @UseGuards(Allow.User)
  async updateUser(
    @Args({ name: "userId", type: () => String }) address: string,
    @Args({ name: "data", type: () => gql.UserInput }) data: gql.UserInput
  ) {
    return await this.userService.updateUser(address, data);
  }
}
