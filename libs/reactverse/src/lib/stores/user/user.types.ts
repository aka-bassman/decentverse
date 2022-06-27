import client from "../apollo";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

export type UserInput = {
  nickname?: string;
  address?: string;
};
export type User = {
  id: string;
  nickname: string;
  address: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};
export const defaultUser: User = {
  id: "",
  nickname: "",
  address: "",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userFragment = gql`
  fragment userFragment on User {
    id
    nickname
    address
    status
    createdAt
    updatedAt
  }
`;
