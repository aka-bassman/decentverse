import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { Stream, Game, Interface, InputName, ReactverseLayout, MapEditor } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, useEditor, useUser, types } from "./stores";
import disableScroll from "disable-scroll";
import { isMobile } from "react-device-detect";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const me = useUser((state) => state);
  const isMapEditorOpen = useEditor((state) => state.isMapEditorOpen);
  useEffect(() => {
    disableScroll.on();
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    return () => {
      disableScroll.off();
    };
  }, []);

  if (isMapEditorOpen) {
    return (
      <ReactverseLayout>
        <MapEditor />
      </ReactverseLayout>
    );
  }

  if (!me.nickname && socket) {
    return (
      <ReactverseLayout>
        {/* <Interface socket={socket} /> */}
        <InputName />
      </ReactverseLayout>
    );
  }
  return (
    <ReactverseLayout>
      {isConnected && socket ? (
        <>
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      ) : (
        <>Connecting...</>
      )}
    </ReactverseLayout>
  );
};
