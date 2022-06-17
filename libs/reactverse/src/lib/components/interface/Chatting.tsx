import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
import { AdminModal } from "./index";
import styled from "styled-components";

export interface ChattingProps {
  socket: Soc;
}

export const Chatting = ({ socket }: ChattingProps) => {
  const chats = useGossip((state) => state.chats);
  useEffect(() => {
    socket.on("chat:public", (chat: types.Chat) => {
      console.log("wip");
    });
    return () => {
      socket.off("chat:public");
    };
  }, []);
  return (
    <div>
      {chats.map((chat, idx) => (
        <Chat key={idx} chat={chat} />
      ))}
      <ChatInput />
    </div>
  );
};

export interface ChatProps {
  chat: types.Chat;
}

export const Chat = ({ chat }: ChatProps) => {
  return <div></div>;
};

export const ChatInput = () => {
  const chatText = useGossip((state) => state.chatText);
  const chat = useGossip((state) => state.chat);
  return <></>;
};
