import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { types, useWorld, RenderCharacter, scalar } from "../../stores";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import { Socket as Soc } from "socket.io-client";

export interface StateManagementProps {
  socket: Soc;
  keyState: MutableRefObject<types.scalar.Keyboard>;
  lockState: MutableRefObject<boolean>;
  scope: MutableRefObject<types.WorldScope>;
  player: MutableRefObject<types.RenderCharacter>;
}

export const StateManagement = ({ socket, keyState, lockState, scope, player }: StateManagementProps) => {
  useKeyboard({ keyState, lockState });
  useGameConnection({ player, scope, socket });
  useWindowDimensions();
  return <></>;
};
