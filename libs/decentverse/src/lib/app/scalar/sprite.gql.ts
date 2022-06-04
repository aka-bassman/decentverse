import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import * as gql from "../gql";

// * Sprite Def Schema Definition

@ObjectType()
@Schema()
export class SpriteDef {
  @Field(() => Int)
  @Prop({ type: Number, required: true })
  row: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  column: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  duration: number;
}
export type SpriteDefType = SpriteDef;
export const SpriteDefSchema = SchemaFactory.createForClass(SpriteDef);

@InputType()
export class SpriteDefInput {
  @Field(() => Int)
  row: number;

  @Field(() => Int)
  column: number;

  @Field(() => Int)
  duration: number;
}
export type SpriteDefInputType = SpriteDefInput;

// * Sprite Schema Definition

@ObjectType()
@Schema()
export class Sprite {
  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  idle: SpriteDefType;

  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  walk: SpriteDefType;
}
export type SpriteType = Sprite;
export const SpriteSchema = SchemaFactory.createForClass(Sprite);

@InputType()
export class SpriteInput {
  @Field(() => SpriteDefInput)
  idle: SpriteDefInputType;

  @Field(() => SpriteDefInput)
  walk: SpriteDefInputType;
}
export type SpriteInputType = SpriteInput;
