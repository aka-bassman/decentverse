import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./map.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);

export const getMap = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/getMap`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
