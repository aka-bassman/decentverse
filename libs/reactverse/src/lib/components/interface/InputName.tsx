import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
// import { CallBox, MyCall } from "./stream";
import { AdminModal } from "./index";
import styled from "styled-components";

export const InputName = () => {
  const user = useWorld((state) => state.me);
  const updateUserId = useWorld((state) => state.updateUserId);
  const [nickname, setNickname] = useState<string>("");
  const onChange = (e: any) => {
    console.log(e);
    setNickname(e.target.value);
  };

  return (
    <Container>
      <AdminModal />
      <Modal>
        What's Your name?
        <InputBox>
          <Input placeholder="  Type your nickname!" value={nickname} onChange={onChange} />
          <Summit onClick={() => updateUserId(nickname)}>Summit!</Summit>
        </InputBox>
      </Modal>
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
  /* height: 300px; */
  padding: 30px;
  font-size: 30px;
  display: inline;
  align-self: center;
  align-content: center;
  justify-content: center;
  border-radius: 20px;
  background: white;
`;
const InputBox = styled.div`
  display: flex;
  margin-top: 10px;
  padding-left: 0px;
`;
const Input = styled.input`
  width: 99%;
  height: 40px;
  border-width: 3px;
  margin-right: 5px;
  padding-left: 10px;
  border-color: #3258d4;
  display: flex;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  background: white;
`;
const Summit = styled.button`
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: white;
  background: #3258d4;
  display: flex;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  :hover {
    opacity: 0.8;
    background: #3ed06c;
  }
`;
