import client from "../apollo";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

export type UserInput = {
  nickname?: string;
  address?: string;
  currentPosition?: number[];
  currentMap?: string;
};
export type User = {
  id: string;
  nickname: string;
  currentPosition?: number[];
  currentMap?: string;
  address?: string;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
};

export const userFragment = gql`
  fragment userFragment on User {
    id
    nickname
    address
    status
    currentPosition
    currentMap
    createdAt
    updatedAt
  }
`;
