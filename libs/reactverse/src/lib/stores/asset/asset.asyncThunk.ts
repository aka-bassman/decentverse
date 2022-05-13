import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as gql from "../gql";
import * as init from "./asset.state";

export const initAssets = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    const assets = await gql.assets();
    dispatch(actions.setAssets(assets));
  }
);
