import client from "../apollo";
import gql from "graphql-tag";
import * as mapTypes from "../map/map.types";
import * as types from "./mapEditor.types";

// * Map Query
export type MapQuery = { map: mapTypes.Map };
export const mapQuery = gql`
  ${mapTypes.mapFragment}
  query map($mapId: String!) {
    map(mapId: $mapId) {
      ...mapFragment
    }
  }
`;
export const map = async (mapId: string) =>
  (
    await client.query<MapQuery>({
      query: mapQuery,
      variables: { mapId },
    })
  ).data.map;

// * Add MapFiles Mutation
export type AddMapFilesMutation = { addMapFiles: types.File[] };
export const addMapFilesMutation = gql`
  ${types.fileFragment}
  mutation addMapFiles($files: [Upload!]!, $mapId: String!, $subGroup: String!) {
    addMapFiles(files: $files, mapId: $mapId, subGroup: $subGroup) {
      ...fileFragment
    }
  }
`;
export const addMapFiles = async (files: any[], mapId: string, subGroup: string) =>
  (
    await client.mutate<AddMapFilesMutation>({
      mutation: addMapFilesMutation,
      variables: { files, mapId, subGroup },
    })
  ).data?.addMapFiles;

// * Add MapFiles Mutation
export type AddMapFileMutation = { addMapFile: types.File[] };
export const addMapFileMutation = gql`
  ${types.fileFragment}
  mutation addMapFile($file: Upload!, $mapId: String!) {
    addMapFile(file: $file, mapId: $mapId) {
      ...fileFragment
    }
  }
`;
export const addMapFile = async (file: any, mapId: string) =>
  (
    await client.mutate<AddMapFileMutation>({
      mutation: addMapFileMutation,
      variables: { file, mapId },
    })
  ).data?.addMapFile;
