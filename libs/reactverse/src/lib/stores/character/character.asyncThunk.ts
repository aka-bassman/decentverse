import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as gql from "../gql";
import * as init from "./character.state";

export const initCharacters = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/initCharacters`,
  async (payload, { getState, dispatch }) => {
    const characters = await gql.characters();
    dispatch(actions.setCharacter(characters));
  }
);
