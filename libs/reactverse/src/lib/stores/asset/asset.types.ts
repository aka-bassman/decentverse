import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type AssetInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  interactions: scalar.Interaction[];
};
export type Asset = {
  id: string;
  top: scalar.File;
  bottom?: scalar.File;
  lighting?: scalar.File;
  interactions: scalar.Interaction[];
  status: string;
  createdAt?: Date;
  updatedAt: Date;
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
    interactions {
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
