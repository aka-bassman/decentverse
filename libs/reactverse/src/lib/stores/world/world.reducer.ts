import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./state";
import { initializeUser, registerUser, modifyUser } from "./asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<any>) => {
      state.onlineUsers = action.payload;
    },
    setUserInput: (state, action: PayloadAction<any>) => {
      state.input = action.payload;
    },
    setHash: (state, action: PayloadAction<string>) => {
      state.hash = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeUser.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initializeUser.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(modifyUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(modifyUser.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
