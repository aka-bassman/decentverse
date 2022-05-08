import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const SocketProvider = ({
  children,
  uri,
}: {
  children: any;
  uri: string;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const socket = io(uri);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    socket.on("world", () => console.log("dispatch updateWorld"));
    setInterval(() => socket.emit("updateMe", ""), 500);
    socket.on("message", () => console.log("receive message"));
    socket.emit("message", "hi");
    return () => {
      socket.close();
    };
  }, []);

  return isConnected ? children : <div>Connecting Socket...</div>;
};
