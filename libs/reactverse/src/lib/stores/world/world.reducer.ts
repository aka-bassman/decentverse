import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./world.state";
import * as types from "../types";
import { initWorld } from "./world.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setWorld: (state: init.WorldState, action: PayloadAction<{ map: types.Map; character: types.Character }>) => {
      state.me = {
        userId: "userId",
        character: action.payload.character,
        position: [50, 50],
        state: "idle",
        direction: "right",
      };
      state.map = action.payload.map;
      state.render.tiles = action.payload.map.tiles.slice(0, 2).map((tiles) => tiles.slice(0, 2));
      state.status = "idle";
    },
    changeScreenSize: (state: init.WorldState, action: PayloadAction<types.Screen>) => {
      state.screen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initWorld.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initWorld.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initWorld.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
