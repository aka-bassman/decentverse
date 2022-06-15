import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type AssetInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  collisions: scalar.Interaction[];
  webviews: scalar.Interaction[];
};
export type Asset = {
  id: string;
  top: scalar.File;
  bottom?: scalar.File;
  lighting?: scalar.File;
  collisions: scalar.Interaction[];
  webviews: scalar.Interaction[];
  status: string;
  createdAt?: Date;
  updatedAt: Date;
};
export type TileInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  interactions: scalar.Interaction[];
};

export const assetFragment = gql`
  ${scalar.fileFragment}
  ${scalar.interactionFragment}
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
    collisions {
      ...interactionFragment
    }
    webviews {
      ...interactionFragment
    }
    status
    # createdAt
    # updatedAt
  }
`;

export type Placement = {
  asset: Asset;
  position: number[];
};
export const placementFragment = gql`
  ${assetFragment}
  fragment placementFragment on Placement {
    asset {
      ...assetFragment
    }
    position
  }
`;
