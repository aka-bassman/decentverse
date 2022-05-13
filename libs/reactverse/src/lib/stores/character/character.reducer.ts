import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./character.state";
import * as types from "../types";
import { initCharacters } from "./character.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setCharacter: (state: init.CharacterState, action: PayloadAction<types.Character[]>) => {
      state.characters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initCharacters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initCharacters.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initCharacters.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
