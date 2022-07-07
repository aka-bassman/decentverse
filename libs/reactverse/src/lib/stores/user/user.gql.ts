import client from "../apollo";
import * as types from "./user.types";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

// * WhoAmI Query
export type WhoAmIQuery = { whoAmI: types.User };

export const whoAmIQuery = gql`
  ${types.userFragment}
  query whoAmI($address: String!, $message: String!, $signAddress: String!) {
    whoAmI(address: $address, message: $message, signAddress: $signAddress) {
      ...userFragment
    }
  }
`;

export const whoAmI = async (address: string, message: string, signAddress: string) =>
  (
    await client.query<WhoAmIQuery>({
      query: whoAmIQuery,
      variables: { address, message, signAddress },
    })
  ).data.whoAmI;

// * WhoAmI Query

export type UpdateUserMutation = { updateUser: types.User };

export const updateUserMutation = gql`
  ${types.userFragment}
  mutation updateUser($userId: String!, $data: UserInput!) {
    updateUser(userId: $userId, data: $data) {
      ...userFragment
    }
  }
`;

export const updateUser = async (userId: string, data: types.UserInput) =>
  (
    await client.mutate<UpdateUserMutation>({
      mutation: updateUserMutation,
      variables: { userId, data },
    })
  ).data?.updateUser;
