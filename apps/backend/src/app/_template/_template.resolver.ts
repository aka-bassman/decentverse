import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { TemplateService } from "./_template.service";
import { Allow, Account, gql } from "@decentverse/server";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query(() => String)
  @UseGuards(Allow.Every)
  ping() {
    return "ping";
  }

  @Query(() => gql.Template)
  @UseGuards(Allow.Admin)
  async me(@Account() account: any) {
    return this.templateService.template(account._id);
  }

  @Query(() => gql.Template)
  @UseGuards(Allow.Admin)
  async template(
    @Args({ name: "templateId", type: () => String }) templateId: string
  ) {
    return this.templateService.template(templateId);
  }

  @Query(() => [gql.Template])
  @UseGuards(Allow.Admin)
  async templates() {
    return this.templateService.templates();
  }

  @Mutation(() => gql.Template)
  @UseGuards(Allow.SuperAdmin)
  async createTemplate(@Args("data") data: gql.TemplateInput) {
    return await this.templateService.createTemplate(data);
  }

  @Mutation(() => gql.Template)
  @UseGuards(Allow.Admin)
  async updateTemplate(
    @Args({ name: "templateId", type: () => String }) templateId: string,
    @Args("data") data: gql.TemplateInput
  ) {
    return await this.templateService.updateTemplate(templateId, data);
  }

  @Mutation(() => gql.Template)
  @UseGuards(Allow.SuperAdmin)
  async removeTemplate(
    @Args({ name: "templateId", type: () => String }) templateId: string
  ) {
    return await this.templateService.removeTemplate(templateId);
  }
}
