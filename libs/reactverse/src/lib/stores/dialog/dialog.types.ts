import client from "../apollo";
import gql from "graphql-tag";
import { Character, characterFragment } from "../character/character.types";
import * as scalar from "../scalar.type";

export type DialogInput = {
  title: string;
  characters: string[];
  flows: scalar.FlowInput[];
};
export type Dialog = {
  id: string;
  title: string;
  characters: Character[];
  flows: scalar.Flow[];
  status: string;
  createdAt?: Date;
  updatedAt: Date;
};

export const dialogFragment = gql`
  ${characterFragment}
  ${scalar.flowFragment}
  fragment dialogFragment on Dialog {
    id
    title
    characters {
      ...characterFragment
    }
    flows {
      ...flowFragment
    }
    status
    # createdAt
    # updatedAt
  }
`;
