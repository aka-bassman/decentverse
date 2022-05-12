import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./world.state";
import { updateMe } from "./world.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setWorld: (state, action: PayloadAction<any>) => {
      state.status = "idle";
    },
    changeScreenSize: (state, action: PayloadAction<init.Screen>) => {
      state.screen = action.payload;
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
