import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./map.state";

export const initMap = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/initMap`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
