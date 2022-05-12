import { createAsyncThunk } from "@reduxjs/toolkit";
import * as graphql from "../types";
import { actions, RootState } from "../redux";
import * as init from "./admin.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);

export const startWorld = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/startWorld`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
