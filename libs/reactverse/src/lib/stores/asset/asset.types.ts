import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type Asset = {
  id: string;
  artLayers: scalar.ArtLayer[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const assetFragment = gql`
  ${scalar.artLayerFragment}
  fragment assetFragment on Asset {
    id
    artLayers {
      ...artLayerFragment
    }
    status
    createdAt
    updatedAt
  }
`;
