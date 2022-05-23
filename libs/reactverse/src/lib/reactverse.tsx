import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "./hooks";
import { Provider } from "react-redux";
import { client } from "./stores";
import { Game, Loop, Screen, Socket, Player } from "./containers";
import { ApolloProvider } from "@apollo/client";
import { PixiTest } from "./components";
import { Canvas } from "@react-three/fiber";
import { CallRoom } from "./hooks/useCallRoom";
import { io, Socket as Soc } from "socket.io-client";

export const Reactverse = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  useEffect(() => {
    const socket = io("localhost:3333");
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
          <CallRoom socket={socket} />
        </>
      )}
    </ApolloProvider>
  );
};
