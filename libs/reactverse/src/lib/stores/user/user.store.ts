import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { isMobile } from "react-device-detect";
import { useWorld } from "../world";

export interface UserState {}
export const useUser = create<UserState>((set, get) => ({}));
