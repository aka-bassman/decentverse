import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "./dialog.types";

// * Dialog Query
export type DialogQuery = { dialog: types.Dialog };
export const dialogQuery = gql`
  ${types.dialogFragment}
  query dialog($dialogId: ID!) {
    dialog(dialogId: $dialogId) {
      ...dialogFragment
    }
  }
`;
export const dialog = async (dialogId: string) =>
  (
    await client.query<DialogQuery>({
      query: dialogQuery,
      variables: { dialogId },
    })
  ).data.dialog;

// * Dialogs Query
export type DialogsQuery = { dialogs: types.Dialog[] };
export const dialogsQuery = gql`
  ${types.dialogFragment}
  query dialogs {
    dialogs {
      status
      ...dialogFragment
    }
  }
`;
export const dialogs = async () =>
  (
    await client.query<DialogsQuery>({
      query: dialogsQuery,
    })
  ).data.dialogs;

// * Create Dialog Mutation
export type CreateDialogMutation = { createDialog: types.Dialog };
export const createDialogMutation = gql`
  ${types.dialogFragment}
  mutation createDialog($data: DialogInput) {
    createDialog(data: $data) {
      ...dialogFragment
    }
  }
`;
export const createDialog = async (data: types.DialogInput) =>
  (
    await client.mutate<CreateDialogMutation>({
      mutation: createDialogMutation,
      variables: { data },
    })
  ).data?.createDialog;

// * Update Dialog Mutation
export type UpdateDialogMutation = { updateDialog: types.Dialog };
export const updateDialogMutation = gql`
  ${types.dialogFragment}
  mutation updateDialog($dialogId: ID, $data: DialogInput) {
    updateDialog(dialogId: $dialog, data: $data) {
      ...dialogFragment
    }
  }
`;
export const updateDialog = async (dialogId: string, data: types.DialogInput) =>
  (
    await client.mutate<UpdateDialogMutation>({
      mutation: updateDialogMutation,
      variables: { dialogId, data },
    })
  ).data?.updateDialog;

// * Remove Admin Mutation
export type RemoveDialogMutation = { removeDialog: types.Dialog };
export const removeDialogMutation = gql`
  ${types.dialogFragment}
  mutation removeDialog($dialogId: DialogInput) {
    removeDialog(dialogId: $dialogId) {
      ...dialogFragment
    }
  }
`;
export const removeDialog = async (dialogId: string) =>
  (
    await client.mutate<RemoveDialogMutation>({
      mutation: removeDialogMutation,
      variables: { dialogId },
    })
  ).data?.removeDialog;
