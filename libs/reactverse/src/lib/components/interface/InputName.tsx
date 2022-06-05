import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
// import { CallBox, MyCall } from "./stream";
import styled from "styled-components";

export interface InterfaceProps {
  socket: Soc;
}

export const InputName = ({ socket }: InterfaceProps) => {
  const user = useWorld((state) => state.me);

  return (
    <Container>
      <Modal>Type your nickname!</Modal>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background: #083266;
`;
const Modal = styled.div`
  width: 600px;
  height: 400px;
  /* font-family: Noto; */
  border-radius: 20px;
  align-self: center;
  background: white;
`;
