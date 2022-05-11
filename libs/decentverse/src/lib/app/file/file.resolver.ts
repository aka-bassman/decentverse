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
  async addFiles(
    @Args({ name: "files", type: () => [GraphQLUpload] })
    files: FileUpload[]
  ) {
    return await this.fileService.addFiles(files);
  }
}
