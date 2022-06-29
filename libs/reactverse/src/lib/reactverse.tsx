import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { Stream, Game, Interface, Login, ReactverseLayout, MapEditor, FullScreenLoading } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, useEditor, useUser, types } from "./stores";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = useWorld((state) => state.status);
  const isLoaded = useWorld((state) => state.isLoaded);
  const loader = useWorld((state) => state.loader);
  const isMapEditorOpen = useEditor((state) => state.isMapEditorOpen);
  const skipLogin = false; // 나중에 query params로 넘겨야함.

  useEffect(() => {
    console.log(uri, ws);
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
  }, []);
  if (!socket || !isConnected) return <FullScreenLoading />;

  return (
    <ReactverseLayout>
      {isMapEditorOpen ? (
        <MapEditor />
      ) : worldStatus === "none" ? (
        <Login />
      ) : (
        <>
          {/* {!isLoaded() && <FullScreenLoading />} */}
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      )}
    </ReactverseLayout>
  );
};
