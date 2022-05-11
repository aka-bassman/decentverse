import { Field, InputType, ObjectType, ID } from "@nestjs/graphql";
import { scalar } from "~app";
import { Types } from "mongoose";
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

  @Field(() => scalar.SpriteInput)
  left: scalar.SpriteInputType;

  @Field(() => scalar.SpriteInput)
  right: scalar.SpriteInputType;

  @Field(() => scalar.SpriteInput, { nullable: true })
  up?: scalar.SpriteInputType;

  @Field(() => scalar.SpriteInput, { nullable: true })
  down?: scalar.SpriteInputType;
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

  @Field(() => scalar.Sprite)
  left: scalar.SpriteType;

  @Field(() => scalar.Sprite)
  right: scalar.SpriteType;

  @Field(() => scalar.Sprite, { nullable: true })
  up?: scalar.SpriteType;

  @Field(() => scalar.Sprite, { nullable: true })
  down?: scalar.SpriteType;

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
