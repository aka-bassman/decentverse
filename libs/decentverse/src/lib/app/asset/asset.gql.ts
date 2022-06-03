import { Field, InputType, ObjectType, ID } from "@nestjs/graphql";
import { Types } from "mongoose";
import * as gql from "../gql";
/**
 * * Akamir GraphQL Schema V2.1
 */

/**
 * Input 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Input은 입력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@InputType()
export class AssetInput {
  @Field(() => String)
  name: string;

  @Field(() => ID, { nullable: true })
  top?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  bottom?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  lighting?: Types.ObjectId;

  @Field(() => [gql.InteractionInput], { nullable: true })
  interactions: gql.InteractionInputType[];
}

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class Asset {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => gql.File, { nullable: true })
  top?: gql.File;

  @Field(() => gql.File, { nullable: true })
  bottom?: gql.File;

  @Field(() => gql.File, { nullable: true })
  lighting?: gql.File;

  @Field(() => [gql.Interaction], { nullable: true })
  interactions: gql.InteractionType[];

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
