import client from "../apollo";
import * as types from "../types";
import gql from "graphql-tag";

export type AdminInput = {
  accountId: string;
  email: string;
  password?: string;
};
export type Admin = {
  id: string;
  accountId: string;
  email: string;
  password?: string;
  role: "manager" | "admin" | "superAdmin";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};

export const adminFragment = gql`
  fragment adminFragment on Admin {
    id
    accountId
    email
    password
    role
    status
    createdAt
    updatedAt
  }
`;

// * Ping Query

export type PingQuery = { ping: string };
export const pingQuery = gql`
  query ping {
    ping
  }
`;
export const ping = async () =>
  (await client.query<PingQuery>({ query: pingQuery })).data.ping;

// * Me Query
export type MeQuery = { me: Admin };
export const meQuery = gql`
  ${adminFragment}
  query me {
    ...adminFragment
  }
`;
export const me = async () =>
  (await client.query<MeQuery>({ query: meQuery })).data.me;

// * Admin Query
export type AdminQuery = { admin: Admin };
export const adminQuery = gql`
  ${adminFragment}
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
export type AdminsQuery = { admins: Admin[] };
export const adminsQuery = gql`
  ${adminFragment}
  query admins {
    admins {
      ...adminFragment
    }
  }
`;
export const admins = async () =>
  (await client.query<AdminsQuery>({ query: adminsQuery })).data.admins;

// * Create Admin Mutation
export type CreateAdminMutation = { createAdmin: Admin };
export const createAdminMutation = gql`
  ${adminFragment}
  mutation createAdmin($data: AdminInput) {
    createAdmin(data: $data) {
      ...adminFragment
    }
  }
`;
export const createAdmin = async (data: AdminInput) =>
  (
    await client.mutate<CreateAdminMutation>({
      mutation: createAdminMutation,
      variables: { data },
    })
  ).data?.createAdmin;

// * Update Admin Mutation

export type UpdateAdminMutation = { updateAdmin: Admin };
export const updateAdminMutation = gql`
  ${adminFragment}
  mutation updateAdmin($data: AdminInput) {
    updateAdmin(data: $data) {
      ...adminFragment
    }
  }
`;
export const updateAdmin = async (data: AdminInput) =>
  (
    await client.mutate<UpdateAdminMutation>({
      mutation: updateAdminMutation,
      variables: { data },
    })
  ).data?.updateAdmin;

// * Remove Admin Mutation
export type RemoveAdminMutation = { removeAdmin: Admin };
export const removeAdminMutation = gql`
  ${adminFragment}
  mutation removeAdmin($data: AdminInput) {
    removeAdmin(data: $data) {
      ...adminFragment
    }
  }
`;
export const removeAdmin = async (data: AdminInput) =>
  (
    await client.mutate<RemoveAdminMutation>({
      mutation: removeAdminMutation,
      variables: { data },
    })
  ).data?.removeAdmin;

// * Signin Admin Mutation
export type SigninAdminMutation = { signinAdmin: types.AccessToken };
export const signinAdminMutation = gql`
  ${adminFragment}
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
