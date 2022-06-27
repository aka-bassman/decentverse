import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
import { Chatting, WebViewModal, MobileController, MicController } from "./index";
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
  return (
    <InterfaceContainer>
      <ChattingContainer>
        <Chatting socket={socket} />
      </ChattingContainer>
      <WebViewModal />
      <MobileController />
      <MicController />
    </InterfaceContainer>
  );
  // return <>{/* <Name>{user.userId}</Name> */}</>;
};

const InterfaceContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 1;
  @media screen and (max-width: 800px) {
    width: 100%;
    height: ${document.documentElement.clientHeight}px;

    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    .Controller {
      width: 100%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 25px;
      padding-left: 25px;
      /* left: 10%; */
      bottom: 15%;
      z-index: 1;
    }
  }
`;
const ChattingContainer = styled.div`
  position: absolute;
  bottom: 0%;
  align-items: center;
  flex-direction: column;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const InteractionButton = styled.button`
  width: ${document.documentElement.clientWidth / 7}px;
  height: ${document.documentElement.clientWidth / 7}px;
  border-radius: 300px;
  margin-left: 20px;
  background-color: white;
  opacity: 0.7;
`;
