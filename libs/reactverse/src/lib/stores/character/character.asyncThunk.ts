import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./character.state";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);

export const getCharacter = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/getCharacter`,
  async (payload, { getState, dispatch }) => {
    return;
  }
);
