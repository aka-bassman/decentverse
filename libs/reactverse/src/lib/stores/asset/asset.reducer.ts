import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./asset.state";
import * as types from "../types";
import { updateMe } from "./asset.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<types.Asset[]>) => {
      state.assets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMe.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(updateMe.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
