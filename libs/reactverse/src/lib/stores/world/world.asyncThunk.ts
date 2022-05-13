import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./world.state";
import * as gql from "../gql";
import * as types from "../types";
export const initWorld = createAsyncThunk<any, void, { state: RootState }>(
  `${init.SLICE_NAME}/initWorld`,
  async (payload, { getState, dispatch }) => {
    const { maps, characters } = await gql.world();
    dispatch(actions.setWorld({ map: maps[0], character: characters[0] }));
  }
);

export const getWorld = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/getWorld`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
