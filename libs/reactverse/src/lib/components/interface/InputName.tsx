import { useEffect, useRef, useState } from "react";
import { useGossip, useWorld, useUser, types } from "../../stores";
import styled, { keyframes } from "styled-components";

export const InputName = ({}) => {
  const me = useUser((state) => state);
  const whoAmI = useUser((state) => state.whoAmI);
  const guest = useUser((state) => state.guest);
  const logout = useUser((state) => state.logout);
  const setName = useUser((state) => state.setName);
  const updateUser = useUser((state) => state.updateUser);
  const updateUserId = useWorld((state) => state.updateUserId);
  const [nickname, setNickname] = useState<string>(me.nickname ?? "");
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    setNickname(me.nickname);
  }, [me.nickname]);

  const onChange = (e: any) => {
    setNickname(e.target.value);
  };

  const onPressMetamask = async () => {
    await whoAmI();
    setCurrentPage(currentPage + 1);
  };
  const onPressOffline = () => {
    guest();
    setNickname(`Guest#${Math.floor(Math.random() * 1000000)}`);
    setCurrentPage(currentPage + 1);
  };

  const onClickGoBack = () => {
    setNickname("");
    logout();
    updateUserId("");
    setCurrentPage(currentPage - 1);
  };
  const onClickSubmit = () => {
    console.log(nickname);
    setName(nickname);
    updateUser({ nickname });
    updateUserId(nickname);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setName(nickname);
      updateUser({ nickname });
      updateUserId(nickname);
    }
  };
  useEffect(() => {
    console.log("nickname : ", me.nickname);
  }, [me.nickname]);
  const process = [
    <>
      <Metamask onClick={onPressMetamask}>Start to metamask</Metamask>
      <Offline onClick={onPressOffline}>Start to Offline</Offline>
    </>,
    <>
      <InputBox onKeyPress={keyPress}>
        <Input autoFocus placeholder="  Type your nickname!" value={nickname} onChange={onChange} />
        <Submit onClick={onClickSubmit}>Submit!</Submit>
      </InputBox>
      <Goback onClick={onClickGoBack}>Go Back</Goback>
    </>,
  ];

  return (
    <Container>
      <Title>Reactverse</Title>
      <Process>{process[currentPage]}</Process>
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
