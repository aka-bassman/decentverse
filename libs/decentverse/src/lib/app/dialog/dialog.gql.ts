import { Field, InputType, ObjectType, ID } from "@nestjs/graphql";
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
export class DialogInput {
  @Field(() => String)
  title: string;

  @Field(() => [ID])
  characters: Types.ObjectId[];

  @Field(() => [gql.FlowInput])
  flows: gql.FlowInputType[];
}

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class Dialog {
  @Field()
  title: string;

  @Field(() => [gql.Character])
  characters: gql.Character[];

  @Field(() => [gql.Flow])
  flows: gql.FlowType[];

  @Field()
  status: "active" | "inactive";

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
