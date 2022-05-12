import { RootState } from "../redux";
export const SLICE_NAME = "admin";

export interface AdminState {
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: AdminState = {
  status: "none",
};
export const select = {
  adminStatus: (state: RootState) => state.admin.status,
};
