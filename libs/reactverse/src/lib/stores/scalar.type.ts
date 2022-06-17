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

export const interactionTypes = ["collision", "webview", "callRoom"] as const;
export type InteractionType = typeof interactionTypes[number];

export type Collision = {
  message?: string;
  topLeft: number[];
  bottomRight: number[];
};
export type CollisionInput = {
  message?: string;
  topLeft: number[];
  bottomRight: number[];
};
export const collisionFragment = gql`
  fragment collisionFragment on Collision {
    message
    topLeft
    bottomRight
  }
`;

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = typeof webviewPurposes[number];
export type Webview = {
  message?: string;
  errorMessage?: string;
  topLeft: number[];
  bottomRight: number[];
  url: string;
  size: number[];
  purpose: WebviewPurpose;
};
export type WebviewInput = {
  message?: string;
  errorMessage?: string;
  topLeft: number[];
  bottomRight: number[];
  url: string;
  size: number[];
  purpose: WebviewPurpose;
};
export const webviewFragment = gql`
  fragment webviewFragment on Webview {
    message
    errorMessage
    topLeft
    bottomRight
    url
    size
    purpose
  }
`;

export type CallRoom = {
  message?: string;
  errorMessage?: string;
  topLeft: number[];
  bottomRight: number[];
  maxNum: number;
};
export type CallRoomInput = {
  message?: string;
  errorMessage?: string;
  topLeft: number[];
  bottomRight: number[];
  maxNum: number;
};
export const callRoomFragment = gql`
  fragment callRoomFragment on CallRoom {
    message
    errorMessage
    topLeft
    bottomRight
    maxNum
  }
`;

export type Tile = {
  top: File;
  bottom: File;
  lighting?: File;
  collisions: Collision[];
  webviews: Webview[];
  callRooms: CallRoom[];
};

export type TileInput = {
  top?: string;
  bottom?: string;
  lighting?: string;
  collisions: CollisionInput[];
  webviews: WebviewInput[];
  callRooms: CallRoomInput[];
};

export const tileFragment = gql`
  ${fileFragment}
  ${collisionFragment}
  ${webviewFragment}
  ${callRoomFragment}
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
    collisions {
      ...collisionFragment
    }
    webviews {
      ...webviewFragment
    }
    callRooms {
      ...callRoomFragment
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
