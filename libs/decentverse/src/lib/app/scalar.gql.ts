import GraphQLJSON from "graphql-type-json";
import { ReadStream } from "fs";
import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

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
export const OpenSeaAttributeSchema =
  SchemaFactory.createForClass(OpenSeaAttribute);

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
export class TokenUrls {
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
export type TokenUrlType = TokenUrls;
export const TokenUrlsSchema = SchemaFactory.createForClass(TokenUrls);

// * Art Layer Schema Definition

export const layerTypes = ["bottom", "top", "lighting"] as const;
export type LayerType = typeof layerTypes[number];
@ObjectType()
@Schema()
export class ArtLayer {
  @Field(() => String)
  @Prop({ type: String, enum: layerTypes, required: true })
  type: LayerType;

  @Field(() => String)
  @Prop({ type: String, required: true })
  url: string;
}
export type ArtLayerType = ArtLayer;
export const ArtLayerSchema = SchemaFactory.createForClass(ArtLayer);

@InputType()
export class ArtLayerInput {
  @Field(() => String)
  type: LayerType;

  @Field(() => String)
  url: string;
}
export type ArtLayerInputType = ArtLayerInput;

// * Sprite Schema Definition

@ObjectType()
@Schema()
export class Sprite {
  @Field(() => String)
  @Prop({ type: String, required: true })
  idle: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  walk: string;
}
export type SpriteType = Sprite;
export const SpriteSchema = SchemaFactory.createForClass(Sprite);

@InputType()
export class SpriteInput {
  @Field(() => String)
  idle: string;

  @Field(() => String)
  walk: string;
}
export type SpriteInputType = SpriteInput;

// * Interaction Schema Definition

export const actionTypes = ["collision"] as const;
export type ActionType = typeof actionTypes[number];

@ObjectType()
@Schema()
export class Interaction {
  @Field(() => String)
  @Prop({ type: String, enum: actionTypes, required: true })
  type: ActionType;

  @Field(() => [Int])
  @Prop([Number])
  topLeft: number[];

  @Field(() => [Int])
  @Prop([Number])
  bottomRight: number[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  url?: string;
}
export type InteractionType = Interaction;
export const InteractionSchema = SchemaFactory.createForClass(Interaction);

@InputType()
export class InteractionInput {
  @Field(() => String)
  type: ActionType;

  @Field(() => [Int])
  topLeft: number[];

  @Field(() => [Int])
  bottomRight: number[];

  @Field(() => String, { nullable: true })
  url?: string;
}
export type InteractionInputType = InteractionInput;

// * Asset Placement Schema Definition

@ObjectType()
@Schema()
export class Placement {
  @Field(() => ID)
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

// * Tile Schema Definition

@ObjectType()
@Schema()
export class Tile {
  @Field(() => String)
  @Prop({ type: String, required: true })
  top: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  bottom: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  lighting: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  interactions: InteractionType[];
}
export type TileType = Tile;
export const TileSchema = SchemaFactory.createForClass(Tile);

@InputType()
export class TileInput {
  @Field(() => String)
  top: string;

  @Field(() => String)
  bottom: string;

  @Field(() => String)
  lighting: string;

  @Field(() => String)
  interactions: InteractionType[];
}
export type TileInputType = TileInput;
