import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useGame } from "../../stores";
import { Button, Input } from "antd";
import { isMobile } from "react-device-detect";

export interface ChattingProps {
  socket: Soc;
}

export const Chatting = ({ socket }: ChattingProps) => {
  const userId = useWorld((state) => state.me.userId);
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
  return (
    <div style={{ backgroundColor: "gray", opacity: "90%", width: "100%", height: 40 }}>
      {/* {chats.map((chat, idx) => (
        <Chat key={idx} chat={chat} />
      ))} */}
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
  const userId = useWorld((state) => state.me.userId);
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
    <Input
      onFocus={() => !isMobile && lockKey(true)}
      onBlur={() => !isMobile && lockKey(false)}
      onMouseOut={() => !isMobile && lockKey(false)}
      style={{
        fontSize: 25,
        backgroundColor: "transparent",
        color: "white",
        width: "100%",
      }}
      value={chatText}
      onChange={onChangeChatText}
      onKeyDown={keyPress}
      placeholder="type..."
    />
  );
  {
    /* <Button style={{ width: 50, backgroundColor: "red" }} onClick={onSubmit} /> */
  }
};
