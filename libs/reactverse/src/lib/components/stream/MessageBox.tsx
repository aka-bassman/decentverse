import { io, Socket as Soc } from "socket.io-client";
import { useGossip } from "../../stores";
import { Message } from "./Message";
export interface MessageBoxProps {
  socket: Soc;
}

export const MessageBox = ({ socket }: MessageBoxProps) => {
  const messages = useGossip((state) => state.messages);
  const message = useGossip((state) => state.message);
  return (
    <div>
      {messages.map((m, idx) => (
        <Message key={idx} {...m} />
      ))}
      <input />
    </div>
  );
};
