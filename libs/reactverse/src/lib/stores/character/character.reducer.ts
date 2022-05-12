import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./character.state";
import { updateMe } from "./character.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setCharacter: (state, action: PayloadAction<any>) => {
      state.status = "idle";
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
