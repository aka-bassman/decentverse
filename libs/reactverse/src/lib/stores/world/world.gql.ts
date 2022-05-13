import client from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";
// * World Query
export type WorldQuery = { maps: types.Map[]; characters: types.Character[] };
export const worldQuery = gql`
  ${types.mapFragment}
  ${types.characterFragment}
  query world {
    maps {
      ...mapFragment
    }
    characters {
      ...characterFragment
    }
  }
`;
export const world = async () =>
  (
    await client.query<WorldQuery>({
      query: worldQuery,
    })
  ).data;
