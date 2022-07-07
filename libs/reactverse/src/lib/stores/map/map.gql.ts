import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "./map.types";
// * Maps Query
export type MapsQuery = { maps: types.Map[] };
export const mapsQuery = gql`
  ${types.mapFragment}
  query maps {
    maps {
      ...mapFragment
    }
  }
`;
export const maps = async () =>
  (
    await client.query<MapsQuery>({
      query: mapsQuery,
    })
  ).data.maps;

// * Create Map Mutation
export type CreateMapMutation = { createMap: types.Map };
export const createMapMutation = gql`
  ${types.mapFragment}
  mutation createMap($data: MapInput!) {
    createMap(data: $data) {
      ...mapFragment
    }
  }
`;
export const createMap = async (data: types.MapInput) =>
  (
    await client.mutate<CreateMapMutation>({
      mutation: createMapMutation,
      variables: { data },
    })
  ).data?.createMap;

// * Update Map Mutation
export type UpdateMapMutation = { updateMap: types.Map };
export const updateMapMutation = gql`
  ${types.mapFragment}
  mutation updateMap($mapId: ID!, $data: MapInput!) {
    updateMap(mapId: $mapId, data: $data) {
      ...mapFragment
    }
  }
`;
export const updateMap = async (mapId: string, data: types.MapInput) =>
  (
    await client.mutate<UpdateMapMutation>({
      mutation: updateMapMutation,
      variables: { mapId, data },
    })
  ).data?.updateMap;

// * Remove Admin Mutation
export type RemoveMapMutation = { removeMap: types.Map };
export const removeMapMutation = gql`
  ${types.mapFragment}
  mutation removeMap($mapId: MapInput) {
    removeMap(mapId: $mapId) {
      ...mapFragment
    }
  }
`;
export const removeMap = async (mapId: string) =>
  (
    await client.mutate<RemoveMapMutation>({
      mutation: removeMapMutation,
      variables: { mapId },
    })
  ).data?.removeMap;
