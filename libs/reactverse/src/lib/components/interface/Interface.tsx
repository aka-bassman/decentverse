import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
// import { CallBox, MyCall } from "./stream";
import { Chatting, WebViewModal } from "./index";

import styled from "styled-components";

export interface InterfaceProps {
  socket: Soc;
}

export const Interface = ({ socket }: InterfaceProps) => {
  const user = useWorld((state) => state.me);
  const setKey = useGame((state) => state.setKey);
  return (
    <div style={{ position: "absolute", top: "0%", left: "0%" }}>
      <Chatting socket={socket} />
      <WebViewModal />
      <button
        style={{ width: 50, margin: 5 }}
        onMouseDown={() => setKey("up", true)}
        onMouseUp={() => setKey("up", false)}
        onTouchStart={() => setKey("up", true)}
        onTouchEnd={() => setKey("up", false)}
      >
        UP
      </button>
      <button
        style={{ width: 50, margin: 5 }}
        onMouseDown={() => setKey("down", true)}
        onMouseUp={() => setKey("down", false)}
        onTouchStart={() => setKey("down", true)}
        onTouchEnd={() => setKey("down", false)}
      >
        DOWN
      </button>
      <button
        style={{ width: 50, margin: 5 }}
        onMouseDown={() => setKey("right", true)}
        onMouseUp={() => setKey("right", false)}
        onTouchStart={() => setKey("right", true)}
        onTouchEnd={() => setKey("right", false)}
      >
        RIGHT
      </button>
      <button
        style={{ width: 50, margin: 5 }}
        onMouseDown={() => setKey("left", true)}
        onMouseUp={() => setKey("left", false)}
        onTouchStart={() => setKey("left", true)}
        onTouchEnd={() => setKey("left", false)}
      >
        LEFT
      </button>
    </div>
  );
  // return <>{/* <Name>{user.userId}</Name> */}</>;
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
