import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

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

@ObjectType()
@Schema()
export class TokenLog {
  @Field()
  @Prop({ type: String, required: true })
  owner: string;

  @Field()
  @Prop({ type: String, required: true })
  previousOwner: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  tokenId: number;

  @Field(() => Int)
  @Prop({ type: Date, required: true })
  updatedAt: Date;
}
export type TokenLogType = TokenLog;
export const TokenLogSchema = SchemaFactory.createForClass(TokenLog);
