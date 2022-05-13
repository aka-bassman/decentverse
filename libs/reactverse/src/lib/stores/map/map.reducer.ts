import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./map.state";
import * as types from "../types";
import { initMap } from "./map.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setMap: (state: init.MapState, action: PayloadAction<any>) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initMap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initMap.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initMap.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
