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
  addPeer: (initiator: boolean, form: types.InitForm, localStream: MediaStream, screenStream?: MediaStream) => void;
  removePeer: (id: string) => void;
  messageText: string;
  toggleMic: () => void;
  toggleCam: () => void;
  setLocalStream: (localStream: MediaStream) => void;
  toggleScreen: (screenStream: MediaStream) => void;
  status: "none" | "loading" | "failed" | "idle";
}
export const useGossip = create<GossipState>((set, get) => ({
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
  addPeer: (initiator: boolean, form: types.InitForm, localStream: MediaStream, screenStream?: MediaStream) =>
    set((state) => ({
      callRoom: {
        ...state.callRoom,
        roomId: form.roomId,
        localStream,
        screenStream,
      },
      peers: [
        ...state.peers,
        {
          id: form.userId,
          nickName: form.nickName,
          mic: 100,
          cam: true,
          quality: 100,
          call: new types.Call(initiator, localStream, screenStream),
        },
      ],
    })),
  removePeer: (id: string) => set((state) => ({ peers: state.peers.filter((p) => p.id !== id) })),
  toggleMic: () =>
    set((state) => {
      if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream.getAudioTracks().length > 0)
        state.callRoom.localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      return { callRoom: { ...state.callRoom, mic: state.callRoom.mic ? 0 : 100 } };
    }),
  toggleCam: () =>
    set((state) => {
      if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream.getVideoTracks().length > 0)
        state.callRoom.localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      return { callRoom: { ...state.callRoom, cam: !state.callRoom.cam } };
    }),
  setLocalStream: (localStream: MediaStream) => set((state) => ({ callRoom: { ...state.callRoom, localStream } })),
  toggleScreen: (screenStream: MediaStream) => {
    const stream = get().callRoom.screenStream;
    return stream
      ? set((state) => {
          state.peers.map((p) => state.callRoom.screenStream && p.call.peer.removeStream(state.callRoom.screenStream));
          return { callRoom: { ...state.callRoom, screenStream: undefined } };
        })
      : set((state) => {
          state.peers.map((p) => p.call.peer.addStream(screenStream));
          return { callRoom: { ...state.callRoom, screenStream } };
        });
  },
  status: "none",
}));
