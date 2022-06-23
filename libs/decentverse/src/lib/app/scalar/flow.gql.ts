import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import * as gql from "../gql";

export const flowStyles = ["speak"] as const;
export type FlowStyle = typeof flowStyles[number];

export const avatarPositions = ["left", "right", "center"] as const;
export type AvatarPosition = typeof avatarPositions[number];

@ObjectType()
@Schema()
export class Flow {
  @Field(() => String)
  @Prop({ type: String, enum: flowStyles, default: "speak", required: true })
  style: FlowStyle;

  @Field(() => String)
  @Prop({ type: String, required: true })
  subject: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "character", required: false })
  character?: Types.ObjectId;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  image?: Types.ObjectId;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  background?: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, enum: avatarPositions, required: true, default: "right" })
  avatarPosition: AvatarPosition;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  name?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  text: string;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  position: number[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  next?: string;
}
export type FlowType = Flow;
export const FlowSchema = SchemaFactory.createForClass(Flow);

@InputType()
export class FlowInput {
  @Field(() => String)
  style: FlowStyle;

  @Field(() => String)
  subject: string;

  @Field(() => ID, { nullable: true })
  character?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  image?: Types.ObjectId;

  @Field(() => String)
  avatarPosition: AvatarPosition;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  text: string;

  @Field(() => [Int])
  position: number[];
}
export type FlowInputType = FlowInput;
