import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { AdminService } from "./admin.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => String)
  @UseGuards(Allow.Every)
  ping() {
    return "ping";
  }

  @Query(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async me(@Account() account: any) {
    return this.adminService.admin(account._id);
  }

  @Query(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async admin(@Args({ name: "adminId", type: () => ID }) adminId: string) {
    return this.adminService.admin(adminId);
  }

  @Query(() => [gql.Admin])
  @UseGuards(Allow.SuperAdmin)
  async admins() {
    return this.adminService.admins();
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async createAdmin(@Args("data") data: gql.AdminInput) {
    return await this.adminService.createAdmin(data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async updateAdmin(
    @Args({ name: "adminId", type: () => String }) adminId: string,
    @Args("data") data: gql.AdminInput
  ) {
    return await this.adminService.updateAdmin(adminId, data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async removeAdmin(@Args({ name: "adminId", type: () => String }) adminId: string) {
    return await this.adminService.removeAdmin(adminId);
  }

  @Mutation(() => gql.AccessToken)
  async signinAdmin(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string
  ) {
    return await this.adminService.signinAdmin(accountId, password);
  }
}
