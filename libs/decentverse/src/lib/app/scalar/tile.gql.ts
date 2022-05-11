import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { InteractionSchema } from "./scalar.gql";
import * as gql from "../gql";

// * Tile Schema Definition

@ObjectType()
@Schema()
export class Tile {
  @Field(() => gql.File, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: "file", required: false })
  top?: Types.ObjectId;

  @Field(() => gql.File)
  @Prop({ type: Types.ObjectId, ref: "file", required: true })
  bottom: Types.ObjectId;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: "file", required: false })
  lighting?: Types.ObjectId;

  @Field(() => [gql.Interaction])
  @Prop([{ type: InteractionSchema, required: true }])
  interactions: gql.InteractionType[];
}
export type TileType = Tile;
export const TileSchema = SchemaFactory.createForClass(Tile);

@InputType()
export class TileInput {
  @Field(() => ID)
  top?: Types.ObjectId;

  @Field(() => ID)
  bottom: Types.ObjectId;

  @Field(() => ID)
  lighting?: Types.ObjectId;

  @Field(() => [gql.InteractionInput])
  interactions: gql.InteractionType[];
}
export type TileInputType = TileInput;
