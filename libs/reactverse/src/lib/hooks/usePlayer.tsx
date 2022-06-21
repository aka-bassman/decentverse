import { MutableRefObject, useEffect, useRef } from "react";
import { RepeatWrapping } from "three";
import { types, useGossip } from "../stores";

export interface PlayerStateManagementProps {
  player: MutableRefObject<types.RenderCharacter>;
}
export const usePlayerStateManagement = ({ player }: PlayerStateManagementProps) => {
  const isTalk = useGossip((state) => state.callRoom.isTalk);
};
