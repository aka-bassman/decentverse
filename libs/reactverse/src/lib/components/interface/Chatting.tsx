import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
import { AdminModal } from "./index";
import styled from "styled-components";
import { Button, Input } from "antd";

export interface ChattingProps {
  socket: Soc;
}

export const Chatting = ({ socket }: ChattingProps) => {
  const chats = useGossip((state) => state.chats);
  const receiveChat = useGossip((state) => state.receiveChat);
  useEffect(() => {
    socket.on("chat:public", (chat: types.Chat) => {
      receiveChat("public", chat);
    });
    return () => {
      socket.off("chat:public");
    };
  }, []);
  return (
    <div style={{ backgroundColor: "black", opacity: "50%", width: 500, height: 500 }}>
      {chats.map((chat, idx) => (
        <Chat key={idx} chat={chat} />
      ))}
      <ChatInput socket={socket} />
    </div>
  );
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
  const chatText = useGossip((state) => state.chatText);
  const onChangeChatText = useGossip((state) => state.onChangeChatText);
  const sendChat = useGossip((state) => state.sendChat);
  const speakChat = useWorld((state) => state.speakChat);
  const lockKey = useGame((state) => state.lockKey);
  const keyPress = async (e: any) => e.key === "Enter" && !e.shiftKey && onSubmit();
  const onSubmit = () => {
    socket.emit("chat", "public", {
      from: "1242",
      fromName: "aaa",
      text: chatText,
      at: new Date(),
    });
    sendChat("public", chatText);
    speakChat(chatText);
    setTimeout(() => speakChat(""), 3000);
  };
  return (
    <div style={{ position: "absolute", bottom: 0 }}>
      <Input
        onFocus={() => lockKey(true)}
        onBlur={(e) => lockKey(false)}
        style={{ backgroundColor: "transparent", color: "white", width: 500, maxWidth: "100%" }}
        value={chatText}
        onChange={onChangeChatText}
        onKeyDown={keyPress}
        placeholder="type..."
      />
      <Button style={{ width: 50, backgroundColor: "red" }} onClick={onSubmit} />
    </div>
  );
};
