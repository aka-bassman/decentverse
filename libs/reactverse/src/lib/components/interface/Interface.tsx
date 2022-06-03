import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
// import { CallBox, MyCall } from "./stream";
import styled from "styled-components";

export interface InterfaceProps {
  socket: Soc;
}

export const Interface = ({ socket }: InterfaceProps) => {
  const user = useWorld((state) => state.me);

  return <>{/* <Name>{user.userId}</Name> */}</>;
};

const Name = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  font-size: 50px;
  transform: translate(-50%, -50%);
`;
const InterfaceContainer = styled.div`
  position: "absolute";
  width: 100%;
  height: 100%;
  background: transparent;
  /* border-width: 100px; */
  z-index: 0;
  .name {
    left: 50%;
    top: 50%;
    font-size: 20px;
  }
`;
