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
    console.log(event);
    if (event.x && event.x > 25) {
      setKey("right", true);
      setKey("left", false);
    } else if (event.x && event.x < -25) {
      setKey("right", false);
      setKey("left", true);
    } else {
      setKey("right", false);
      setKey("left", false);
    }

    //top
    if (event.y && event.y > 25) {
      setKey("down", false);
      setKey("up", true);
    } else if (event.y && event.y < -25) {
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
    <InterfaceContainer>
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          // height: "100%",
        }}
      >
        <Chatting socket={socket} />
      </div>

      <div style={{ top: "0%", left: "0%" }}>
        <WebViewModal />
      </div>
      {isMobile && (
        <div
          style={{ position: "absolute", display: "flex", alignItems: "center", left: "5%", bottom: "5%", zIndex: 10 }}
        >
          <Joystick size={100} baseColor="#656565" stickColor="#adadad" move={handleMove} stop={handleStop} />
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
    </InterfaceContainer>
  );
  // return <>{/* <Name>{user.userId}</Name> */}</>;
};

const InterfaceContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  @media screen and (max-width: 500px) {
    width: 150%;
    height: 150vh;
    /* border-width: 10px;
    border-color: blue; */
    overflow: "hidden";
    overflow-y: "hidden";
    overflow-x: "hidden";
    /* background-color: red; */
    /* flex-direction: column; */
  }
  border-width: 10px;
  z-index: 1;
`;
