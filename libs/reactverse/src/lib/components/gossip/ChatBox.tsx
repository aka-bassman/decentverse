import { io, Socket as Soc } from "socket.io-client";
import { useGossip } from "../../stores";
import { Chat } from "./Chat";
export interface ChatBoxProps {
  socket: Soc;
}

export const ChatBox = ({ socket }: ChatBoxProps) => {
  const chats = useGossip((state) => state.chats);
  const chat = useGossip((state) => state.chat);
  return (
    <div>
      {chats.map((c, idx) => (
        <Chat key={idx} {...c} />
      ))}
      <input />
    </div>
  );
};
