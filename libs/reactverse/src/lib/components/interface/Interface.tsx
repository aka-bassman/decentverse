import { useEffect, useRef, useState } from "react";
import { ShareScreenIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "..";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
// import { CallBox, MyCall } from "./stream";
import styled from "styled-components";

export interface InterfaceProps {
  socket: Soc;
}

export const Interface = ({ socket }: InterfaceProps) => {
  const callRoom = useGossip((state) => state.callRoom);

  return <InterfaceContainer></InterfaceContainer>;
};

const InterfaceContainer = styled.div`
  position: "absolute";
  width: 100%;
  height: 100%;
`;
