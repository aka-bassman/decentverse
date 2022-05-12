import gql from "graphql-tag";

export type AccessToken = {
  accessToken: string;
};

export const accessTokenFragment = gql`
  fragment accessTokenFragment on AccessToken {
    accessToken
  }
`;

export type OpenSeaAttribute = {
  display_type?: string;
  trait_type: string;
  value: string;
};

export const openSeaAttributeFragment = gql`
  fragment openSeaAttributeFragment on OpenSeaAttribute {
    display_type
    trait_type
    value
  }
`;

export type OpenSeaMeta = {
  name: string;
  external_url: string;
  image: string;
  description: string;
  attributes: OpenSeaAttribute[];
};
export const openSeaMetaFragment = gql`
  ${openSeaAttributeFragment}
  fragment openSeaMetaFragment on OpenSeaMeta {
    name
    external_url
    image
    description
    attributes {
      ...openSeaAttributeFragment
    }
  }
`;

export type TokenUrl = {
  url: string;
  imageUrl: string;
  meta: OpenSeaMeta;
};
export const tokenUrlFragment = gql`
  ${openSeaMetaFragment}
  fragment tokenUrlFragment on tokenUrl {
    url
    imageUrl
    meta {
      ...openSeaMetaFragment
    }
  }
`;

export const layerTypes = ["bottom", "top", "lighting"] as const;
export type LayerType = typeof layerTypes[number];

export type ArtLayer = {
  type: LayerType;
  url: string;
};
export const artLayerFragment = gql`
  fragment artLayerFragment on ArtLayer {
    type
    url
  }
`;

export type Sprite = {
  idle: string;
  walk: string;
};
export const spriteFragment = gql`
  fragment spriteFragment on Sprite {
    idle
    walk
  }
`;

export const actionTypes = ["collision"] as const;
export type ActionType = typeof actionTypes[number];

export type Interaction = {
  type: ActionType;
  topLeft: number[];
  bottomRight: number[];
  url?: string;
};
export const interactionFragment = gql`
  fragment interactionFragment on Interaction {
    type
    topLeft
    bottomRight
    url
  }
`;

export type Placement = {
  asset: string;
  position: number[];
};
export const placementFragment = gql`
  fragment placementFragment on Placement {
    asset
    position
  }
`;

export type Tile = {
  top: string;
  bottom: string;
  lighting: string;
  interactions: Interaction[];
};
export const tileFragment = gql`
  ${interactionFragment}
  fragment tileFragment on Tile {
    top
    bottom
    lighting
    interactions {
      ...interactionFragment
    }
  }
`;

export type File = {
  id: string;
  url: string;
};
export const fileFragment = gql`
  fragment fileFragment on File {
    id
    url
  }
`;
