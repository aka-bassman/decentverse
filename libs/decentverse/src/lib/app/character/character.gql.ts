import { Field, InputType, ObjectType, ID, Int } from "@nestjs/graphql";
import * as gql from "../gql";
import { Types, Schema as MongoSchema } from "mongoose";
/**
 * * Akamir GraphQL Schema V2.1
 */

/**
 * Input 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Input은 입력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@InputType()
export class CharacterInput {
  @Field(() => ID, { nullable: true })
  contract?: Types.ObjectId;

  @Field()
  tokenId: number;

  @Field(() => ID)
  file: Types.ObjectId;

  @Field(() => [Int])
  tileSize: number[];

  @Field(() => [Int])
  totalSize: number[];

  @Field(() => gql.SpriteInput)
  right: gql.SpriteInputType;

  @Field(() => gql.SpriteInput)
  left: gql.SpriteInputType;

  @Field(() => gql.SpriteInput, { nullable: true })
  up?: gql.SpriteInputType;

  @Field(() => gql.SpriteInput, { nullable: true })
  down?: gql.SpriteInputType;
}

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class Character {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  contract?: string;

  @Field()
  tokenId: number;

  @Field(() => gql.File)
  file: gql.File;

  @Field(() => [Int])
  tileSize: number[];

  @Field(() => [Int])
  totalSize: number[];

  @Field(() => gql.Sprite)
  right: gql.SpriteType;

  @Field(() => gql.Sprite)
  left: gql.SpriteType;

  @Field(() => gql.Sprite, { nullable: true })
  up?: gql.SpriteType;

  @Field(() => gql.Sprite, { nullable: true })
  down?: gql.SpriteType;

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
