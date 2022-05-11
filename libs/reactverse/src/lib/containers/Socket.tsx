import { useState, useEffect } from "react";
import { io, Socket as Soc } from "socket.io-client";

// 소켓 데이터 처리를 주로 진행
export const Socket = ({ children, uri }: { children: any; uri: string }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc | null>(null);
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
