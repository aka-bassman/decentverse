import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FileService } from "./file.service";
import { Allow, Account } from "../../middlewares";
import * as gql from "../../app/gql";
import { UseGuards } from "@nestjs/common";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createReadStream, createWriteStream, fstat } from "fs";

@Resolver(() => gql.File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}
  @Mutation(() => gql.File)
  @UseGuards(Allow.Admin)
  async addAssetFiles(
    @Args({ name: "files", type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args({ name: "group", type: () => String }) group: string
  ) {
    return await this.fileService.addFiles(files, "asset", group);
  }
  @Mutation(() => gql.File)
  @UseGuards(Allow.Admin)
  async addMapFiles(
    @Args({ name: "files", type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args({ name: "group", type: () => String }) group: string
  ) {
    return await this.fileService.addFiles(files, "map", group);
  }
  @Mutation(() => gql.File)
  @UseGuards(Allow.Admin)
  async addCharacterFiles(
    @Args({ name: "files", type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args({ name: "group", type: () => String }) group: string
  ) {
    return await this.fileService.addFiles(files, "character", group);
  }
}
