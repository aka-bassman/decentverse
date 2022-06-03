import client from "../apollo";
import gql from "graphql-tag";
import * as types from "../map/map.types";
// * Map Query
export type MapQuery = { map: types.Map };
export const mapQuery = gql`
  ${types.mapFragment}
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
