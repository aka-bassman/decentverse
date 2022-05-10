import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  createSlice,
  applyMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { HYDRATE } from "next-redux-wrapper";
import { createWrapper } from "next-redux-wrapper";

import * as admin from "./admin";
import * as asset from "./asset";
import * as character from "./character";
import * as map from "./map";
import * as world from "./world";

export type RootState = {
  admin: admin.AdminState;
  asset: asset.AssetState;
  character: character.CharacterState;
  map: map.MapState;
  world: world.WorldState;
};

const reducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return combineReducers({
    admin: admin.slice.reducer,
    asset: asset.slice.reducer,
    character: character.slice.reducer,
    map: map.slice.reducer,
    world: world.slice.reducer,
  })(state, action);
};

export const store = configureStore({ reducer });
export const actions = {
  ...admin.slice.actions,
  ...admin.asyncThunk,
  ...asset.slice.actions,
  ...asset.asyncThunk,
  ...character.slice.actions,
  ...character.asyncThunk,
  ...map.slice.actions,
  ...map.asyncThunk,
  ...world.slice.actions,
  ...world.asyncThunk,
};

export const select = {
  ...admin.select,
  ...asset.select,
  ...character.select,
  ...map.select,
  ...world.select,
};

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper(() => store, {
  debug: process.env.NODE_ENV !== "production",
});
