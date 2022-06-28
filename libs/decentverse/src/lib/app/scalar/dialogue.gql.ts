import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import * as gql from "../gql";

@ObjectType()
@Schema()
export class Dialogue {
  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];

  @Field(() => gql.Dialog)
  @Prop({ type: MongoSchema.Types.ObjectId, required: true })
  dialog: Types.ObjectId;
}
export type DialogueType = Dialogue;
export const DialogueSchema = SchemaFactory.createForClass(Dialogue);

@InputType()
export class DialogueInput {
  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];

  @Field(() => ID)
  dialog: Types.ObjectId;
}
export type DialogueInputType = DialogueInput;
