import client from "../apollo";
import gql from "graphql-tag";

export const keyTypes = ["left", "right", "up", "down", "interaction"] as const;
export type KeyType = typeof keyTypes[number];
export type Keyboard = { [key in KeyType]: boolean };
