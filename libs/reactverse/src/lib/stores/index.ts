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

// import * as user from "./user";

export type RootState = {
  //   user: user.UserState;
};

const reducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return combineReducers({
    // user: user.slice.reducer,
  })(state, action);
};

export const store = configureStore({
  reducer,
  //   middleware: customizedMiddleware,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
export const actions = {
  //   ...user.slice.actions,
  //   ...user.asyncThunk,
};

export const select = {
  //   ...user.select,
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
