import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class AccessToken {
  @Field(() => String)
  accessToken: string;
}

export { GraphQLJSON as JSON };
