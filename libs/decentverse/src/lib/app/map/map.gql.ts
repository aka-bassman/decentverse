import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";
import { scalar } from "~app";
/**
 * * Akamir GraphQL Schema V2.1
 */

/**
 * Input 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Input은 입력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@InputType()
export class MapInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  tileSize: number;

  @Field(() => [[scalar.TileInput]])
  tiles: scalar.TileInputType[][];

  @Field(() => [scalar.PlacementInput])
  placements: scalar.PlacementInputType[];

  @Field(() => [scalar.InteractionInput])
  interactions: scalar.InteractionInputType[];
}

/**
 * 객체 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Object Type의 출력데이터의 field들을 작성합니다. Field 내에는 gql 속성을, 타입값에는 데이터 타입을 지정합니다.
 * * 복잡한 속성이 있는 경우, 이는 scalar.schema.ts로 빼서 작업하세요.
 */

@ObjectType()
export class Map {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  tileSize: number;

  @Field(() => [[scalar.Tile]])
  tiles: scalar.TileType[][];

  @Field(() => [scalar.Placement])
  placements: scalar.PlacementType[];

  @Field(() => [scalar.Interaction])
  interactions: scalar.InteractionType[];

  @Field(() => String)
  status: "active" | "inactive";

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
