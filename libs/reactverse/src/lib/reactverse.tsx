import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "./hooks";
import { Provider } from "react-redux";
import { client } from "./stores";
import { ApolloProvider } from "@apollo/client";
import { PixiTest, Stream } from "./components";
import { Game } from "./containers";
import { Canvas } from "@react-three/fiber";
import { io, Socket as Soc } from "socket.io-client";

export const Reactverse = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  useEffect(() => {
    const socket = io("192.168.31.240:3333");
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
  }, []);
  return (
    <ApolloProvider client={client}>
      {isConnected && socket && (
        <>
          <div>
            <h1>Welcome to Reactverse!</h1>
          </div>
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      )}
    </ApolloProvider>
  );
};
