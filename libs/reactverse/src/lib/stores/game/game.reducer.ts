import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./game.state";
// import { updateMe } from "./world.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setKey: (state, action: PayloadAction<{ key: init.KeyType; state: boolean }>) => {
      state.keyboard[action.payload.key] = action.payload.state;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(updateMe.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(updateMe.rejected, (state) => {
  //       state.status = "idle";
  //     })
  //     .addCase(updateMe.fulfilled, (state) => {
  //       state.status = "idle";
  //     });
  // },
});
