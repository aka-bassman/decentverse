import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./asset.state";
import * as types from "../types";
import { initAssets } from "./asset.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setAssets: (state: init.AssetState, action: PayloadAction<types.Asset[]>) => {
      state.assets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAssets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initAssets.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initAssets.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
