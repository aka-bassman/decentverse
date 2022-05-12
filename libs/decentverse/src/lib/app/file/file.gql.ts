import { Field, InputType, ObjectType } from "@nestjs/graphql";

import { ReadStream } from "fs-capacitor";

/**
 * * Akamir GraphQL Schema V2.1
 */

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class File {
  @Field(() => String)
  id: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  encoding: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
export type FileStream = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
};
export type LocalFile = {
  filename: string;
  mimetype: string;
  encoding: string;
  localPath: string;
};
