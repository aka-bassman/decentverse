import create from "zustand";
import * as types from "./gossip.types";
export interface GossipState {
  chats: types.Chat[];
  messages: types.Message[];
  chatText: string;
  callRoom: types.CallRoom;
  peers: types.PeerStream[];
  chat: () => void;
  message: () => void;
  addPeer: (initiator: boolean, localStream: MediaStream, screenStream?: MediaStream) => void;
  messageText: string;
  status: "none" | "loading" | "failed" | "idle";
}
export const useGossip = create<GossipState>((set) => ({
  chats: [],
  messages: [],
  chatText: "",
  messageText: "",
  callRoom: {
    roomId: "",
    roomType: "none",
    mic: 100,
    cam: false,
    fullNum: 0,
  },
  peers: [],
  chat: () => set((state) => ({ chats: [...state.chats] })),
  message: () => set((state) => ({ chats: [...state.messages] })),
  addPeer: (initiator: boolean, localStream: MediaStream, screenStream?: MediaStream) =>
    set((state) => ({
      callRoom: {
        ...state.callRoom,
        localStream,
        screenStream,
      },
      peers: [
        ...state.peers,
        {
          id: "",
          nickName: "nickName",
          mic: 100,
          cam: true,
          quality: 100,
          call: new types.Call(initiator, localStream, screenStream),
          status: "none",
        },
      ],
    })),
  status: "none",
}));
