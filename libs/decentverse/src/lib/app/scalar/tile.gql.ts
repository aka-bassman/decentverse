import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongoSchema } from "mongoose";
import { CollisionSchema, CallRoomSchema, WebviewSchema } from "./scalar.gql";
import * as gql from "../gql";

// * Tile Schema Definition

@ObjectType()
@Schema()
export class Tile {
  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  top?: Types.ObjectId;

  @Field(() => gql.File)
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: true })
  bottom: Types.ObjectId;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "file", required: false })
  lighting?: Types.ObjectId;

  @Field(() => [gql.Collision])
  @Prop([{ type: CollisionSchema, required: true }])
  collisions: gql.CollisionType[];

  @Field(() => [gql.Webview])
  @Prop([{ type: WebviewSchema, required: true }])
  webviews: gql.WebviewType[];

  @Field(() => [gql.CallRoom])
  @Prop([{ type: CallRoomSchema, required: true }])
  callRooms: gql.CallRoomType[];

  @Field(() => [gql.Dialogue])
  @Prop([{ type: gql.DialogueSchema, required: true }])
  dialogues: gql.DialogueType[];
}
export type TileType = Tile;
export const TileSchema = SchemaFactory.createForClass(Tile);

@InputType()
export class TileInput {
  @Field(() => ID, { nullable: true })
  top?: Types.ObjectId;

  @Field(() => ID)
  bottom: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  lighting?: Types.ObjectId;

  @Field(() => [gql.CollisionInput])
  collisions: gql.CollisionInputType[];

  @Field(() => [gql.WebviewInput])
  webviews: gql.WebviewInputType[];

  @Field(() => [gql.CallRoomInput])
  callRooms: gql.CallRoomInputType[];

  @Field(() => [gql.DialogueInput])
  dialogues: gql.DialogueInputType[];
}
export type TileInputType = TileInput;
