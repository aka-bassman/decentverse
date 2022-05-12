import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./world.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);

export const getWorld = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/getWorld`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
