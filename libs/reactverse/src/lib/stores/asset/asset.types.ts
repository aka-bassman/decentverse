import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type AssetInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  collisions: scalar.CollisionInput[];
  webviews: scalar.WebviewInput[];
};
export type Asset = {
  id: string;
  top: scalar.File;
  bottom?: scalar.File;
  lighting?: scalar.File;
  collisions: scalar.Collision[];
  webviews: scalar.Webview[];
  status: string;
  createdAt?: Date;
  updatedAt: Date;
};

export const assetFragment = gql`
  ${scalar.fileFragment}
  ${scalar.collisionFragment}
  ${scalar.webviewFragment}
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
      ...collisionFragment
    }
    webviews {
      ...webviewFragment
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
