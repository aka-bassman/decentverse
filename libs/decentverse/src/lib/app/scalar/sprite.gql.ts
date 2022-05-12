import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import * as gql from "../gql";

// * Sprite Schema Definition

@ObjectType()
@Schema()
export class Sprite {
  @Field(() => gql.File)
  @Prop({ type: Types.ObjectId, ref: "file", required: true })
  idle: Types.ObjectId;

  @Field(() => gql.File)
  @Prop({ type: Types.ObjectId, ref: "file", required: true })
  walk: Types.ObjectId;
}
export type SpriteType = Sprite;
export const SpriteSchema = SchemaFactory.createForClass(Sprite);

@InputType()
export class SpriteInput {
  @Field(() => ID)
  idle: Types.ObjectId;

  @Field(() => ID)
  walk: Types.ObjectId;
}
export type SpriteInputType = SpriteInput;
