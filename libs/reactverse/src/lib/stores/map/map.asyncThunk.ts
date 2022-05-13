import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../redux";
import * as init from "./map.state";
import * as gql from "../gql";

export const initMap = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/initMap`,
  async (payload, { getState, dispatch }) => {
    const maps = await gql.maps();
    if (!maps.length) return;
    dispatch(actions.setMap(maps[0]));
  }
);
