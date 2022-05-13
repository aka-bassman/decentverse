import { createAsyncThunk } from "@reduxjs/toolkit";
import * as gql from "../gql";
import { actions, RootState } from "../redux";
import * as init from "./admin.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
