import client from "../apollo";
import * as types from "./admin.types";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

// * Ping Query

export type PingQuery = { ping: string };
export const pingQuery = gql`
  query ping {
    ping
  }
`;
export const ping = async () => (await client.query<PingQuery>({ query: pingQuery })).data.ping;

// * Me Query
export type MeQuery = { me: types.Admin };
export const meQuery = gql`
  ${types.adminFragment}
  query me {
    ...adminFragment
  }
`;
export const me = async () => (await client.query<MeQuery>({ query: meQuery })).data.me;

// * Admin Query
export type AdminQuery = { admin: types.Admin };
export const adminQuery = gql`
  ${types.adminFragment}
  query admin($adminId: ID!) {
    admin(adminId: $adminId) {
      ...adminFragment
    }
  }
`;
export const admin = async (adminId: string) =>
  (
    await client.query<AdminQuery>({
      query: adminQuery,
      variables: { adminId },
    })
  ).data.admin;

// * Admins Query
export type AdminsQuery = { admins: types.Admin[] };
export const adminsQuery = gql`
  ${types.adminFragment}
  query admins {
    admins {
      ...adminFragment
    }
  }
`;
export const admins = async () => (await client.query<AdminsQuery>({ query: adminsQuery })).data.admins;

// * Create Admin Mutation
export type CreateAdminMutation = { createAdmin: types.Admin };
export const createAdminMutation = gql`
  ${types.adminFragment}
  mutation createAdmin($data: AdminInput) {
    createAdmin(data: $data) {
      ...adminFragment
    }
  }
`;
export const createAdmin = async (data: types.AdminInput) =>
  (
    await client.mutate<CreateAdminMutation>({
      mutation: createAdminMutation,
      variables: { data },
    })
  ).data?.createAdmin;

// * Update Admin Mutation

export type UpdateAdminMutation = { updateAdmin: types.Admin };
export const updateAdminMutation = gql`
  ${types.adminFragment}
  mutation updateAdmin($adminId: ID, $data: AdminInput) {
    updateAdmin(adminId: $adminId, data: $data) {
      ...adminFragment
    }
  }
`;
export const updateAdmin = async (adminId: string, data: types.AdminInput) =>
  (
    await client.mutate<UpdateAdminMutation>({
      mutation: updateAdminMutation,
      variables: { adminId, data },
    })
  ).data?.updateAdmin;

// * Remove Admin Mutation
export type RemoveAdminMutation = { removeAdmin: types.Admin };
export const removeAdminMutation = gql`
  ${types.adminFragment}
  mutation removeAdmin($adminId: ID) {
    removeAdmin(adminId: $adminId) {
      ...adminFragment
    }
  }
`;
export const removeAdmin = async (adminId: string) =>
  (
    await client.mutate<RemoveAdminMutation>({
      mutation: removeAdminMutation,
      variables: { adminId },
    })
  ).data?.removeAdmin;

// * Signin Admin Mutation
export type SigninAdminMutation = { signinAdmin: scalar.AccessToken };
export const signinAdminMutation = gql`
  ${types.adminFragment}
  mutation signinAdmin($accountId: String, $password: String) {
    signinAdmin(accountId: $accountId, password: $password) {
      ...adminFragment
    }
  }
`;
export const signinAdmin = async (accountId: string, password: string) =>
  (
    await client.mutate<SigninAdminMutation>({
      mutation: signinAdminMutation,
      variables: { accountId, password },
    })
  ).data?.signinAdmin;
