import client from "../apollo";
import * as scalar from "../scalar.type";
import gql from "graphql-tag";

export type AdminInput = {
  accountId: string;
  email: string;
  password?: string;
};
export type Admin = {
  id: string;
  accountId: string;
  email: string;
  password?: string;
  role: "manager" | "admin" | "superAdmin";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};

export const adminFragment = gql`
  fragment adminFragment on Admin {
    id
    accountId
    email
    password
    role
    status
    createdAt
    updatedAt
  }
`;
