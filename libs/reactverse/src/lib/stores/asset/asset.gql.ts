import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "./asset.types";

// * Asset Query
export type AssetQuery = { asset: types.Asset };
export const assetQuery = gql`
  ${types.assetFragment}
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
export type AssetsQuery = { assets: types.Asset[] };
export const assetsQuery = gql`
  ${types.assetFragment}
  query assets {
    assets {
      ...assetFragment
    }
  }
`;
export const assets = async () =>
  (
    await client.query<AssetsQuery>({
      query: assetsQuery,
    })
  ).data.assets;

// * Create Asset Mutation
export type CreateAssetMutation = { createAsset: types.Asset };
export const createAssetMutation = gql`
  ${types.assetFragment}
  mutation createAsset($data: AssetInput) {
    createAsset(data: $data) {
      ...assetFragment
    }
  }
`;
export const createAsset = async (data: types.AssetInput) =>
  (
    await client.mutate<CreateAssetMutation>({
      mutation: createAssetMutation,
      variables: { data },
    })
  ).data?.createAsset;

// * Update Asset Mutation
export type UpdateAssetMutation = { updateAsset: types.Asset };
export const updateAssetMutation = gql`
  ${types.assetFragment}
  mutation updateAsset($assetId: ID, $data: AssetInput) {
    updateAsset(assetId: $asset, data: $data) {
      ...assetFragment
    }
  }
`;
export const updateAsset = async (assetId: string, data: types.AssetInput) =>
  (
    await client.mutate<UpdateAssetMutation>({
      mutation: updateAssetMutation,
      variables: { assetId, data },
    })
  ).data?.updateAsset;

// * Remove Admin Mutation
export type RemoveAssetMutation = { removeAsset: types.Asset };
export const removeAssetMutation = gql`
  ${types.assetFragment}
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
