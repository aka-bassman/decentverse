import GraphQLJSON from "graphql-type-json";
import { ReadStream } from "fs";
import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
export class AccessToken {
  @Field(() => String)
  accessToken: string;
}

export { GraphQLJSON as JSON };

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}
export { GraphQLUpload } from "graphql-upload";

// * OpenSea Attribute Schema Definition

@ObjectType()
@Schema()
export class OpenSeaAttribute {
  @Field({ nullable: true })
  @Prop({ type: String })
  display_type?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  trait_type: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  value: string;
}
export type OpenSeaAttributeType = OpenSeaAttribute;
export const OpenSeaAttributeSchema = SchemaFactory.createForClass(OpenSeaAttribute);

// * NFT Metadata Schema Definition

@ObjectType()
@Schema()
export class OpenSeaMeta {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  external_url: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  image: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => [OpenSeaAttribute])
  @Prop([OpenSeaAttributeSchema])
  attributes: OpenSeaAttribute[];
}
export type OpenSeaMetaType = OpenSeaMeta;
export const OpenSeaMetaSchema = SchemaFactory.createForClass(OpenSeaMeta);

// * Token Data Schema Definition

@ObjectType()
@Schema()
export class TokenUrl {
  @Field()
  @Prop({ type: String, required: true })
  url: string;

  @Field()
  @Prop({ type: String, required: true })
  imageUrl: string;

  @Field(() => OpenSeaMeta)
  @Prop({ type: OpenSeaMetaSchema })
  meta: OpenSeaMetaType;
}
export type TokenUrlType = TokenUrl;
export const TokenUrlSchema = SchemaFactory.createForClass(TokenUrl);

// * Interaction Schema Definition

export const actionTypes = ["collision"] as const;
export type ActionType = typeof actionTypes[number];

@ObjectType()
@Schema()
export class Interaction {
  @Field(() => String)
  @Prop({ type: String, enum: actionTypes, required: true })
  type: ActionType;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  url?: string;
}
export type InteractionType = Interaction;
export const InteractionSchema = SchemaFactory.createForClass(Interaction);

@InputType()
export class InteractionInput {
  @Field(() => String)
  type: ActionType;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];

  @Field(() => String, { nullable: true })
  url?: string;
}
export type InteractionInputType = InteractionInput;

export const filePurposes = ["asset", "character", "map"] as const;
export type FilePurpose = typeof filePurposes[number];
