import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "../types";

export type AssetInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  interactions: types.Interaction[];
};
export type Asset = {
  id: string;
  top: types.File;
  bottom?: types.File;
  lighting?: types.File;
  interactions: types.Interaction[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const assetFragment = gql`
  ${types.fileFragment}
  ${types.interactionFragment}
  fragment assetFragment on Asset {
    id
    top {
      ...fileFragment
    }
    bottom {
      ...fileFragment
    }
    lighting {
      ...fileFragment
    }
    interactions {
      ...interactionFragment
    }
    status
    createdAt
    updatedAt
  }
`;

// * Asset Query
export type AssetQuery = { asset: Asset };
export const assetQuery = gql`
  ${assetFragment}
  query asset($assetId: ID!) {
    asset(assetId: $assetId) {
      ...assetFragment
    }
  }
`;
export const asset = async (assetId: string) =>
  (
    await client.query<AssetQuery>({
      query: assetQuery,
      variables: { assetId },
    })
  ).data.asset;

// * Assets Query
export type AssetsQuery = { assets: Asset[] };
export const assetsQuery = gql`
  ${assetFragment}
  query assets {
    assets {
      ...assetFragment
    }
  }
`;
export const assets = async () =>
  (
    await client.query<AssetsQuery>({
      query: assetQuery,
    })
  ).data.assets;

// * Create Admin Mutation
export type CreateAssetMutation = { createAsset: Asset };
export const createAssetMutation = gql`
  ${assetFragment}
  mutation createAsset($data: AssetInput) {
    createAsset(data: $data) {
      ...assetFragment
    }
  }
`;
export const createAsset = async (data: AssetInput) =>
  (
    await client.mutate<CreateAssetMutation>({
      mutation: createAssetMutation,
      variables: { data },
    })
  ).data?.createAsset;

// * Update Admin Mutation
export type UpdateAssetMutation = { updateAsset: Asset };
export const updateAssetMutation = gql`
  ${assetFragment}
  mutation updateAsset($adminId: ID, $data: AssetInput) {
    updateAsset(adminId: $admin, data: $data) {
      ...assetFragment
    }
  }
`;
export const updateAsset = async (adminId: string, data: AssetInput) =>
  (
    await client.mutate<UpdateAssetMutation>({
      mutation: updateAssetMutation,
      variables: { adminId, data },
    })
  ).data?.updateAsset;

// * Remove Admin Mutation
export type RemoveAssetMutation = { removeAsset: Asset };
export const removeAssetMutation = gql`
  ${assetFragment}
  mutation removeAsset($assetId: AssetInput) {
    removeAsset(assetId: $assetId) {
      ...assetFragment
    }
  }
`;
export const removeAsset = async (assetId: string) =>
  (
    await client.mutate<RemoveAssetMutation>({
      mutation: removeAssetMutation,
      variables: { assetId },
    })
  ).data?.removeAsset;
