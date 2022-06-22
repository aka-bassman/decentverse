import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";

export type RoleInput = {
  name: string;
  areas: scalar.AreaInput[];
};
export type Role = {
  id: string;
  name: string;
  areas: scalar.Area[];
  status: string;
  createdAt?: Date;
  updatedAt: Date;
};

export const roleFragment = gql`
  ${scalar.areaFragment}
  fragment roleFragment on Role {
    id
    name
    areas {
      ...areaFragment
    }
    status
    # createdAt
    # updatedAt
  }
`;

export type Placement = {
  role: Role;
  position: number[];
};
export const placementFragment = gql`
  ${roleFragment}
  fragment placementFragment on Placement {
    role {
      ...roleFragment
    }
    position
  }
`;
