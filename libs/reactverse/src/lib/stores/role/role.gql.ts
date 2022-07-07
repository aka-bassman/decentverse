import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "./role.types";

// * Role Query
export type RoleQuery = { role: types.Role };
export const roleQuery = gql`
  ${types.roleFragment}
  query role($roleId: ID!) {
    role(roleId: $roleId) {
      ...roleFragment
    }
  }
`;
export const role = async (roleId: string) =>
  (
    await client.query<RoleQuery>({
      query: roleQuery,
      variables: { roleId },
    })
  ).data.role;

// * Roles Query
export type RolesQuery = { roles: types.Role[] };
export const rolesQuery = gql`
  ${types.roleFragment}
  query roles {
    roles {
      ...roleFragment
    }
  }
`;
export const roles = async () =>
  (
    await client.query<RolesQuery>({
      query: rolesQuery,
    })
  ).data.roles;

// * Create Role Mutation
export type CreateRoleMutation = { createRole: types.Role };
export const createRoleMutation = gql`
  ${types.roleFragment}
  mutation createRole($data: RoleInput) {
    createRole(data: $data) {
      ...roleFragment
    }
  }
`;
export const createRole = async (data: types.RoleInput) =>
  (
    await client.mutate<CreateRoleMutation>({
      mutation: createRoleMutation,
      variables: { data },
    })
  ).data?.createRole;

// * Update Role Mutation
export type UpdateRoleMutation = { updateRole: types.Role };
export const updateRoleMutation = gql`
  ${types.roleFragment}
  mutation updateRole($roleId: ID, $data: RoleInput) {
    updateRole(roleId: $role, data: $data) {
      ...roleFragment
    }
  }
`;
export const updateRole = async (roleId: string, data: types.RoleInput) =>
  (
    await client.mutate<UpdateRoleMutation>({
      mutation: updateRoleMutation,
      variables: { roleId, data },
    })
  ).data?.updateRole;

// * Remove Admin Mutation
export type RemoveRoleMutation = { removeRole: types.Role };
export const removeRoleMutation = gql`
  ${types.roleFragment}
  mutation removeRole($roleId: RoleInput) {
    removeRole(roleId: $roleId) {
      ...roleFragment
    }
  }
`;
export const removeRole = async (roleId: string) =>
  (
    await client.mutate<RemoveRoleMutation>({
      mutation: removeRoleMutation,
      variables: { roleId },
    })
  ).data?.removeRole;
