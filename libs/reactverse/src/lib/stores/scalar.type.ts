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

export type SpriteDef = {
  row: number;
  column: number;
  duration: number;
};

export type Sprite = {
  idle: SpriteDef;
  walk: SpriteDef;
};
export const spriteFragment = gql`
  fragment spriteFragment on Sprite {
    idle {
      row
      column
      duration
    }
    walk {
      row
      column
      duration
    }
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

export type Tile = {
  top: File;
  bottom: File;
  lighting?: File;
  interactions: Interaction[];
};
export const tileFragment = gql`
  ${fileFragment}
  ${interactionFragment}
  fragment tileFragment on Tile {
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
  }
`;

export const keyMap = {
  KeyW: "up",
  KeyA: "left",
  KeyS: "down",
  KeyD: "right",
  ArrowUp: "up",
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
} as const;
export type Key = keyof typeof keyMap;

export const keyTypes = ["up", "left", "down", "right"] as const;
export type KeyType = typeof keyTypes[number];
export const keyboard = {
  left: false,
  right: false,
  up: false,
  down: false,
};
export type Keyboard = { [key in KeyType]: boolean };
