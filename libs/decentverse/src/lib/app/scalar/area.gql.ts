import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import * as gql from "../gql";

@ObjectType()
@Schema()
export class Area {
  @Field(() => ID)
  @Prop({ type: MongoSchema.Types.ObjectId, required: true, index: true })
  map: Types.ObjectId;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];
}
export type AreaType = Area;
export const AreaSchema = SchemaFactory.createForClass(Area);

@InputType()
export class AreaInput {
  @Field(() => ID)
  map: Types.ObjectId;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];
}
export type AreaInputType = AreaInput;
