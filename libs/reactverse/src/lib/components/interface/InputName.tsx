import { useEffect, useRef, useState } from "react";
import { useGossip, useWorld, useUser, types } from "../../stores";
import styled, { keyframes } from "styled-components";
import { AdminModal } from "./index";

export const InputName = () => {
  const user = useUser((state) => state.user);
  const characters = useUser((state) => state.characters);
  const loginMethod = useUser((state) => state.loginMethod);
  const whoAmI = useUser((state) => state.whoAmI);
  const loginAsGuest = useUser((state) => state.loginAsGuest);
  const logout = useUser((state) => state.logout);
  const setNickname = useUser((state) => state.setNickname);
  const updateUser = useUser((state) => state.updateUser);
  const updateUserId = useWorld((state) => state.updateUserId);
  const initWorld = useWorld((state) => state.initWorld);

  const onClickSubmit = () => {
    updateUser();
    // updateUserId(nickname);
    initWorld(user, characters[0] ?? types.defaultCharacter);
  };
  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => e.key === "Enter" && onClickSubmit();

  return (
    <Container>
      <AdminModal />
      <Title>AYIAS</Title>
      {loginMethod === "none" ? (
        <>
          <Metamask onClick={whoAmI}>Login with Metamask</Metamask>
          <Offline onClick={loginAsGuest}>Start as a Guest</Offline>
        </>
      ) : (
        <>
          <InputBox onKeyPress={keyPress}>
            <Input
              autoFocus
              placeholder="  Type your nickname!"
              value={user.nickname}
              onChange={(e: any) => setNickname(e.target.value)}
            />
            <Submit onClick={onClickSubmit}>Next</Submit>
          </InputBox>
          <Goback onClick={logout}>Back</Goback>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 50px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #083266;
`;
const Process = styled.div``;
const Title = styled.div`
  font-size: 120px;
  margin-bottom: 300px;
`;
const InputBox = styled.div`
  display: flex;
  margin-top: 10px;
  padding-left: 0px;
`;
const Input = styled.input`
  width: 99%;
  height: auto;
  font-size: 28px;
  border-width: 3px;
  margin-right: 5px;
  padding-left: 10px;
  border-color: #3258d4;
  color: black;
  display: flex;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  background: white;
`;
const Submit = styled.button`
  width: auto;
  height: auto;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: white;
  background: #3258d4;

  align-self: center;
  justify-self: center;
  border-radius: 10px;
  :hover {
    opacity: 0.8;
    background: #3ed06c;
  }
`;
const Goback = styled.button`
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: white;
  background: gray;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  :hover {
    opacity: 0.8;
  }
`;

const Metamask = styled.button`
  width: 500px;
  height: auto;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  align-items: center;
  justify-content: center;
  color: white;
  background: #3258d4;
  display: flex;
  border-radius: 10px;
  :hover {
    opacity: 0.8;
    /* background: #3ed06c; */
  }
`;
const Offline = styled.button`
  width: 500px;
  height: auto;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: white;
  background: gray;
  display: flex;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  :hover {
    opacity: 0.8;
  }
`;
