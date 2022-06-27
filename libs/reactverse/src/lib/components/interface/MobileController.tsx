import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
import { Chatting, WebViewModal } from "./index";
import { MicOnIcon, MicOffIcon, InteractionIcon } from "..";
import { Joystick } from "react-joystick-component";
import { isMobile, isIOS } from "react-device-detect";
import styled from "styled-components";

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
  distance: number | null;
}

const width = document.documentElement.clientWidth;
export const MobileController = ({}) => {
  const setKey = useGame((state) => state.setKey);
  const interaction = useWorld((state) => state.interaction);
  const callRoom = useGossip((state) => state.callRoom);
  const setMic = useGossip((state) => state.setMic);

  const handleMove = (event: IJoystickUpdateEvent) => {
    if (event.x && event.x > width / 2 / 10) {
      setKey("right", true);
      setKey("left", false);
    } else if (event.x && event.x < -(width / 2) / 10) {
      setKey("right", false);
      setKey("left", true);
    } else {
      setKey("right", false);
      setKey("left", false);
    }

    //top
    if (event.y && event.y > width / 2 / 10) {
      setKey("down", false);
      setKey("up", true);
    } else if (event.y && event.y < -(width / 2) / 10) {
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

  const toggleMyMic = async () => {
    const mic = callRoom.mic ? 0 : 100;
    setMic(mic);
  };

  const enableInteraction = () => setKey("interaction", true);
  const disableItneraction = () => setKey("interaction", false);
  return (
    <>
      {isMobile && (
        <Container>
          <Joystick
            size={document.documentElement.clientWidth / 5}
            baseColor="#656565"
            stickColor="#adadad"
            move={handleMove}
            stop={handleStop}
          />
          <ButtonContainer>
            {interaction.callRoom && (
              <Control>
                <IconButton onClick={toggleMyMic}>{callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
              </Control>
            )}
            {interaction.webview && (
              <InteractionButton onTouchStart={enableInteraction} onTouchEnd={disableItneraction}>
                <InteractionIcon />
              </InteractionButton>
            )}
          </ButtonContainer>
        </Container>
      )}
    </>
  );
  // return <>{/* <Name>{user.userId}</Name> */}</>;
};

const Container = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 25px;
  padding-left: ${width / 9}px;
  /* left: 10%; */
  bottom: 15%;
  z-index: 1;
`;

const ButtonContainer = styled.button`
  display: flex;
  background-color: transparent;
`;
const InteractionButton = styled.button`
  width: ${width / 7}px;
  height: ${width / 7}px;
  border-radius: 300px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Control = styled.div`
  display: flex;
  justify-content: center;
  z-index: 3;
`;

const IconButton = styled.button`
  background: white;
  width: ${width / 7}px;
  height: ${width / 7}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
`;
