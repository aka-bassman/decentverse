import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./game.state";

export const game = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/game`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
