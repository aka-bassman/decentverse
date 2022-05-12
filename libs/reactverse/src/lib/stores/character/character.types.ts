import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type Character = {
  id: string;
  contract?: string;
  tokenId: number;
  left: scalar.Sprite;
  right: scalar.Sprite;
  up?: scalar.Sprite;
  down?: scalar.Sprite;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const characterFragment = gql`
  ${scalar.spriteFragment}
  fragment characterFragment on Character {
    id
    contract
    tokenId
    left {
      ...spriteFragment
    }
    right {
      ...spriteFragment
    }
    up {
      ...spriteFragment
    }
    down {
      ...spriteFragment
    }
    status
    createdAt
    updatedAt
  }
`;
