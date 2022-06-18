import GraphQLJSON from "graphql-type-json";
import { ReadStream } from "fs";
import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema, ObjectId } from "mongoose";

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

export const filePurposes = ["asset", "character", "map"] as const;
export type FilePurpose = typeof filePurposes[number];

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = typeof webviewPurposes[number];

@ObjectType()
@Schema()
export class Collision {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];
}
export type CollisionType = Collision;
export const CollisionSchema = SchemaFactory.createForClass(Collision);

@InputType()
export class CollisionInput {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];
}
export type CollisionInputType = CollisionInput;

@ObjectType()
@Schema()
export class Webview {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];

  @Field(() => String)
  @Prop({ type: String })
  url: string;

  @Field(() => [Int])
  @Prop([Number])
  size: number[];

  @Field(() => String)
  @Prop({ type: String, required: true, default: "default", enum: webviewPurposes })
  purpose: WebviewPurpose;
}
export type WebviewType = Webview;
export const WebviewSchema = SchemaFactory.createForClass(Webview);

@InputType()
export class WebviewInput {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];

  @Field(() => String)
  url: string;

  @Field(() => [Int])
  size: number[];

  @Field(() => String)
  purpose: WebviewPurpose;
}
export type WebviewInputType = WebviewInput;

@ObjectType()
@Schema()
export class CallRoom {
  @Field(() => String, { nullable: false })
  @Prop({ type: String })
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 100 })
  maxNum: number;
}
export type CallRoomType = CallRoom;
export const CallRoomSchema = SchemaFactory.createForClass(CallRoom);

@InputType()
export class CallRoomInput {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];

  @Field(() => Int)
  maxNum: number;
}
export type CallRoomInputType = CallRoomInput;
