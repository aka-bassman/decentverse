import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame, useUser } from "../../stores";
import { Button, Input } from "antd";
import { isMobile } from "react-device-detect";
import { SendIcon } from "..";
import styled from "styled-components";

export interface ChattingProps {
  socket: Soc;
}

export const Chatting = ({ socket }: ChattingProps) => {
  const userId = useWorld((state) => state.me.id);
  const chats = useGossip((state) => state.chats);
  const receiveChat = useGossip((state) => state.receiveChat);

  useEffect(() => {
    socket.on("chat:public", (chat: types.Chat) => {
      if (chat.from === userId) return;
      receiveChat("public", chat);
    });
    return () => {
      socket.off("chat:public");
    };
  }, []);
  return <>{isMobile ? <ChatInputMobile socket={socket} /> : <ChatInput socket={socket} />}</>;
};

export interface ChatProps {
  chat: types.Chat;
}

export const Chat = ({ chat }: ChatProps) => {
  return (
    <div style={{ color: "white" }}>
      {chat.fromName}: {chat.text}
    </div>
  );
};

export const ChatInput = ({ socket }: ChattingProps) => {
  const userId = useWorld((state) => state.me.id);
  const chatText = useGossip((state) => state.chatText);
  const onChangeChatText = useGossip((state) => state.onChangeChatText);
  const sendChat = useGossip((state) => state.sendChat);
  const speakChat = useWorld((state) => state.speakChat);
  const lockKey = useGame((state) => state.lockKey);
  const keyPress = async (e: any) => e.key === "Enter" && !e.shiftKey && onSubmit();
  const timeout = useRef<NodeJS.Timeout>();
  const onSubmit = () => {
    if (timeout.current) clearInterval(timeout.current);
    const chat = {
      from: userId,
      fromName: userId,
      text: chatText,
      at: new Date(),
    };
    socket.emit("chat", "public", chat);
    sendChat("public", chatText);
    speakChat(chatText);
    timeout.current = setTimeout(() => speakChat(""), 3000);
  };
  return (
    <div
      style={{
        backgroundColor: "#4b46467f",
        width: "90%",
        maxWidth: 2000,
        borderRadius: 20,
        height: 50,
        marginBottom: 10,
      }}
    >
      <Input
        onFocus={() => !isMobile && lockKey(true)}
        onBlur={() => !isMobile && lockKey(false)}
        onMouseOut={() => !isMobile && lockKey(false)}
        style={{
          fontSize: 25,
          backgroundColor: "transparent",
          color: "white",
          width: "100%",
          borderRadius: 20,
          borderColor: "transparent",
        }}
        value={chatText}
        onChange={onChangeChatText}
        onKeyDown={keyPress}
        placeholder="type..."
      />
    </div>
  );
  {
    /* <Button style={{ width: 50, backgroundColor: "red" }} onClick={onSubmit} /> */
  }
};
export const ChatInputMobile = ({ socket }: ChattingProps) => {
  const userId = useWorld((state) => state.me.id);
  const chatText = useGossip((state) => state.chatText);
  const onChangeChatText = useGossip((state) => state.onChangeChatText);
  const sendChat = useGossip((state) => state.sendChat);
  const speakChat = useWorld((state) => state.speakChat);
  const lockKey = useGame((state) => state.lockKey);
  const keyPress = async (e: any) => e.key === "Enter" && !e.shiftKey && onSubmit();
  const timeout = useRef<NodeJS.Timeout>();
  const onSubmit = () => {
    if (timeout.current) clearInterval(timeout.current);
    const chat = {
      from: userId,
      fromName: userId,
      text: chatText,
      at: new Date(),
    };
    socket.emit("chat", "public", chat);
    sendChat("public", chatText);
    speakChat(chatText);
    timeout.current = setTimeout(() => speakChat(""), 3000);
  };
  return (
    <div style={{ width: "100%", marginBottom: 10, borderRadius: 20 }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          marginBottom: 10,
        }}
      >
        <div style={{ backgroundColor: "#4b46467f", width: "80%", height: "100%", borderRadius: 40 }}>
          <Input
            onFocus={() => !isMobile && lockKey(true)}
            onBlur={() => !isMobile && lockKey(false)}
            onMouseOut={() => !isMobile && lockKey(false)}
            style={{
              fontSize: 18,
              backgroundColor: "transparent",
              color: "white",
              width: "100%",
              borderRadius: 20,
              borderColor: "transparent",
            }}
            value={chatText}
            onChange={onChangeChatText}
            onKeyDown={keyPress}
            placeholder="type..."
          />
        </div>
        <SendButton onClick={onSubmit}>
          <SendIcon
            width={document.documentElement.clientWidth / 20}
            height={document.documentElement.clientWidth / 20}
          />
        </SendButton>
      </div>
    </div>
  );
};

const SendButton = styled.button`
  width: ${document.documentElement.clientWidth / 8}px;
  height: ${document.documentElement.clientWidth / 8}px;
  border-radius: ${document.documentElement.clientWidth / 8}px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  :active {
    opacity: 0.7;
  }
`;
