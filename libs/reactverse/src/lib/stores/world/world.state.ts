import { RootState } from "../index";
import { gql } from "@akamir/common";

export const SLICE_NAME = "user";

export interface UserState {
  data: gql.User;
  onlineUsers: gql.User[];
  hash: string;
  status: "none" | "loading" | "failed" | "idle";
  input: {
    coordinate: number[];
    languages: number[];
    props: number[];
  };
}
export const initialState: UserState = {
  data: null,
  onlineUsers: [],
  hash: null,
  status: "none",
  input: {
    // coordinate: [40.7569545, -73.990494],
    coordinate: [],
    languages: [],
    props: [],
  },
};
export const select = {
  user: (state: RootState) => state.user.data,
  onlineUsers: (state: RootState) => state.user.onlineUsers,
  userInput: (state: RootState) => state.user.input,
  userStatus: (state: RootState) => state.user.status,
};
