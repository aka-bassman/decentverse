import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { Stream, Game, Interface, Login, ReactverseLayout, MapEditor, GameLoading } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, useEditor, useUser, types } from "./stores";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSkip, setIsSkip] = useState(true);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = useWorld((state) => state.status);
  const isLoaded = useWorld((state) => state.isLoaded);
  const loader = useWorld((state) => state.loader);
  const skipLoginProcess = useUser((state) => state.skipLoginProcess);
  const initWorld = useWorld((state) => state.initWorld);
  const loadingStatus = useWorld((state) => state.loadingStatus);
  const updateUser = useUser((state) => state.updateUser);
  const isMapEditorOpen = useEditor((state) => state.isMapEditorOpen);

  useEffect(() => {
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    const url = window.location.href;
    if (url.includes("guest=true")) {
      loadingStatus();
      skipLoginProcess();
      initWorld();
    }
  }, []);
  if (!socket || !isConnected) return;

  return (
    <ReactverseLayout>
      {isMapEditorOpen ? (
        <MapEditor />
      ) : worldStatus === "none" ? (
        <Login />
      ) : (
        <>
          {!isLoaded() && <GameLoading />}
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      )}
    </ReactverseLayout>
  );
};
