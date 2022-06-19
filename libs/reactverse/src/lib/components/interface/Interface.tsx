import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
import { Chatting, WebViewModal } from "./index";
import { Joystick } from "react-joystick-component";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
  distance: number | null;
}

export interface InterfaceProps {
  socket: Soc;
}

export const Interface = ({ socket }: InterfaceProps) => {
  const user = useWorld((state) => state.me);
  const setKey = useGame((state) => state.setKey);
  const handleMove = (event: IJoystickUpdateEvent) => {
    if (event.x && event.x > 37.5) {
      setKey("right", true);
      setKey("left", false);
    } else if (event.x && event.x < -37.5) {
      setKey("right", false);
      setKey("left", true);
    } else {
      setKey("right", false);
      setKey("left", false);
    }

    //top
    if (event.y && event.y > 37.5) {
      setKey("down", false);
      setKey("up", true);
    } else if (event.y && event.y < -37.5) {
      setKey("down", true);
      setKey("up", false);
    } else {
      setKey("down", false);
      setKey("up", false);
    }
  };
  const handleStop = (event: IJoystickUpdateEvent) => {
    setKey("down", false);
    setKey("up", false);
    setKey("left", false);
    setKey("right", false);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        <Chatting socket={socket} />
      </div>

      <div style={{ top: "0%", left: "0%" }}>
        <WebViewModal />
      </div>
      {isMobile && (
        <div style={{ position: "absolute", display: "flex", alignItems: "center", left: "5%", bottom: "-40%" }}>
          <Joystick size={150} baseColor="#656565" stickColor="#adadad" move={handleMove} stop={handleStop} />
          <button
            onTouchStart={() => {
              setKey("interaction", true);
            }}
            onTouchEnd={() => {
              setKey("interaction", false);
            }}
            style={{ width: 75, height: 75, borderRadius: 300, marginLeft: 20, opacity: 0.7 }}
          >
            F
          </button>
        </div>
      )}
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
