import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type CharacterInput = {
  contract?: string;
  tokenId: string;
  file: string;
  tileSize: number[];
  totalSize: number[];
  right: scalar.Sprite;
  left: scalar.Sprite;
  up?: scalar.Sprite;
  down?: scalar.Sprite;
};

export type Character = {
  id: string;
  contract?: string;
  tokenId: number;
  file: scalar.File;
  tileSize: number[];
  totalSize: number[];
  right: scalar.Sprite;
  left: scalar.Sprite;
  up?: scalar.Sprite;
  down?: scalar.Sprite;
  status: string;
};

export const characterFragment = gql`
  ${scalar.fileFragment}
  ${scalar.spriteFragment}
  fragment characterFragment on Character {
    id
    contract
    tokenId
    file {
      ...fileFragment
    }
    tileSize
    totalSize
    right {
      ...spriteFragment
    }
    left {
      ...spriteFragment
    }
    up {
      ...spriteFragment
    }
    down {
      ...spriteFragment
    }
    status
  }
`;
