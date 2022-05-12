import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import * as gql from "../gql";
// * Asset Placement Schema Definition

@ObjectType()
@Schema()
export class Placement {
  @Field(() => gql.Asset)
  @Prop({ type: Types.ObjectId, required: true, ref: "asset" })
  asset: Types.ObjectId;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true, min: 0 }])
  position: number[];
}
export type PlacementType = Placement;
export const PlacementSchema = SchemaFactory.createForClass(Placement);

@InputType()
export class PlacementInput {
  @Field(() => ID)
  asset: Types.ObjectId;

  @Field(() => [Int])
  position: number[];
}
export type PlacementInputType = PlacementInput;
