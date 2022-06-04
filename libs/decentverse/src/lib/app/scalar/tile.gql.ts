import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import { InteractionSchema } from "./scalar.gql";
import * as gql from "../gql";

// * Tile Schema Definition

@ObjectType()
@Schema()
export class Tile {
  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  top?: MongoSchema.Types.ObjectId;

  @Field(() => gql.File)
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: true })
  bottom: MongoSchema.Types.ObjectId;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  lighting?: MongoSchema.Types.ObjectId;

  @Field(() => [gql.Interaction])
  @Prop([{ type: InteractionSchema, required: true }])
  interactions: gql.InteractionType[];
}
export type TileType = Tile;
export const TileSchema = SchemaFactory.createForClass(Tile);

@InputType()
export class TileInput {
  @Field(() => ID)
  top?: MongoSchema.Types.ObjectId;

  @Field(() => ID)
  bottom: MongoSchema.Types.ObjectId;

  @Field(() => ID)
  lighting?: MongoSchema.Types.ObjectId;

  @Field(() => [gql.InteractionInput])
  interactions: gql.InteractionType[];
}
export type TileInputType = TileInput;
