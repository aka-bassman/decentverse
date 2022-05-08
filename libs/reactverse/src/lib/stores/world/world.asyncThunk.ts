import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, RootState } from "../index";
import * as init from "./world.state";
import * as graphql from "~/graphqls";
import { gql } from "@akamir/common";

export const updateMe = createAsyncThunk<void, void, { state: RootState }>(
  `${init.SLICE_NAME}/updateMe`,
  async (_, { dispatch, getState }: any) => {}
);
