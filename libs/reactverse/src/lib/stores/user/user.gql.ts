import client from "../apollo";
// import * as types from "./user.types";
import * as types from "../types";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

// * WhoAmI Query
export type WhoAmIQuery = { whoAmI: types.User };

export const whoAmIQuery = gql`
  ${types.userFragment}
  query whoAmI($address: String!) {
    whoAmI(address: $address) {
      ...userFragment
    }
  }
`;

export const whoAmI = async (address: string) =>
  (
    await client.query<WhoAmIQuery>({
      query: whoAmIQuery,
      variables: { address },
    })
  ).data.whoAmI;

export type GetUserTokenListQuery = { getUserTokenList: [number] };
export const getUserTokenListQuery = gql`
  query getUserTokenList($address: String!, $contract: String!) {
    getUserTokenList(address: $address, contract: $contract)
  }
`;

export const getUserTokenList = async (address: string, contract: string) =>
  (
    await client.query<GetUserTokenListQuery>({
      query: getUserTokenListQuery,
      variables: { address, contract },
    })
  ).data.getUserTokenList;

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

export type SigninUserMutation = { signinUser: { accessToken: string } };

export const signinUserMutation = gql`
  mutation signinUser($userId: String!) {
    signinUser(userId: $userId) {
      accessToken
    }
  }
`;

export const signinUser = async (userId: string) =>
  (
    await client.mutate<SigninUserMutation>({
      mutation: signinUserMutation,
      variables: { userId },
    })
  ).data?.signinUser.accessToken;
