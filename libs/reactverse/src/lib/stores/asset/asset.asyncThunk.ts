import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./asset.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);

export const getAsset = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/getAsset`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
