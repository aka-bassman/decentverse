import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type Map = {
  id: string;
  name: string;
  tileSize: number;
  tiles: scalar.Tile[][];
  placements: scalar.Placement[];
  interactions: scalar.Interaction[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mapFragment = gql`
  ${scalar.tileFragment}
  ${scalar.placementFragment}
  ${scalar.interactionFragment}
  fragment mapFragment on Map {
    id
    name
    tileSize
    tiles {
      ...tileFragment
    }
    placements {
      ...placementFragment
    }
    interactions {
      ...interactionFragment
    }
    status
    createdAt
    updatedAt
  }
`;
