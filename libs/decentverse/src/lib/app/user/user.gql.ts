import { Field, InputType, ObjectType, ID } from "@nestjs/graphql";

/**
 * * Akamir MongoDB & GraphQL Schema V2.2
 */

/**
 * Input 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Input은 도큐먼트를 생성할 때 입력하는 field들을 작성합니다. Prop 내에는 속성을, 필드값에는 타입을 지정합니다.
 * ? Input을 통해 도큐먼트를 생성 시 자동으로 생성되는 field들을 작성합니다. Prop 내 속성에는 반드시 default 필드가 있어야합니다.
 * * 복잡한 속성이 있는 경우, 이는 shared code로 빼서 작업하세요.
 */

@InputType()
export class UserInput {
  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  nickname: string;

  @Field(() => [Number], { nullable: true })
  currentPosition?: number[];

  @Field(() => String, { nullable: true })
  currentMap?: string;
}

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  nickname: string;

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [Number], { nullable: true })
  currentPosition?: number[];

  @Field(() => String, { nullable: true })
  currentMap?: string;
}
