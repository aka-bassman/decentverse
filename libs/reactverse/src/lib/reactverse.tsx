import React, { useState, useEffect } from "react";
import { client } from "./stores";
import { ApolloProvider } from "@apollo/client";
import { Stream, Game, Interface } from "./components";
import { io, Socket as Soc } from "socket.io-client";

export const Reactverse = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  useEffect(() => {
    const socket = io("192.168.1.179:3333");
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
  }, []);

  return (
    <ApolloProvider client={client}>
      {isConnected && socket && (
        <div style={{ width: "100%", height: "100vh" }}>
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </div>
      )}
    </ApolloProvider>
  );
};
