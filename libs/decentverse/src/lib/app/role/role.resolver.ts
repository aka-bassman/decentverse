import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { RoleService } from "./role.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../app/gql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}
  @Query(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async role(@Args({ name: "roldId", type: () => ID }) roleId: string) {
    return this.roleService.role(roleId);
  }

  @Query(() => [gql.Admin])
  @UseGuards(Allow.SuperAdmin)
  async roles() {
    return this.roleService.roles();
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async createRole(@Args("data") data: gql.RoleInput) {
    return await this.roleService.createRole(data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async updateRole(@Args({ name: "roleId", type: () => String }) roleId: string, @Args("data") data: gql.RoleInput) {
    return await this.roleService.updateRole(roleId, data);
  }

  @Mutation(() => gql.Admin)
  @UseGuards(Allow.SuperAdmin)
  async removeRole(@Args({ name: "roleId", type: () => String }) roleId: string) {
    return await this.roleService.removeRole(roleId);
  }
}
