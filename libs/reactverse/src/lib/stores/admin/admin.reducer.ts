import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./admin.state";
import { updateMe } from "./admin.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setAdmin: (state: init.AdminState, action: PayloadAction<any>) => {
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
