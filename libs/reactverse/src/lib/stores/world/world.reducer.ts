import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import * as asyncThunk from "./asyncThunk";
import * as init from "./world.state";
import * as types from "../types";
import { initWorld } from "./world.asyncThunk";

export const slice = createSlice({
  name: init.SLICE_NAME,
  initialState: init.initialState,
  reducers: {
    setWorld: (state: init.WorldState, action: PayloadAction<{ map: types.Map; character: types.Character }>) => {
      state.me = {
        userId: "userId",
        character: action.payload.character,
        render: {
          src: action.payload.character.right.idle.url,
          flip: false,
          position: [50, 50],
          velocity: [0, 0],
        },
        state: "idle",
        direction: "right",
        maxSpeed: 2,
        acceleration: 1,
        deceleration: 1,
      };
      state.map = action.payload.map;
      state.render.tiles = action.payload.map.tiles.slice(0, 2).map((tiles) => tiles.slice(0, 2));
      state.status = "idle";
    },
    accelMe: (state: init.WorldState, action: PayloadAction<types.Keyboard>) => {
      if (!state.me) return;
      // const decelSpeed = [
      //   Math.min(Math.abs(state.me.render.velocity[0]), state.me.deceleration),
      //   Math.min(Math.abs(state.me.render.velocity[1]), state.me.deceleration),
      // ];
      // const deceleration = [
      //   state.me.render.velocity[0] > 0 ? -decelSpeed[0] : decelSpeed[0],
      //   state.me.render.velocity[1] > 0 ? -decelSpeed[1] : decelSpeed[1],
      // ];
      // const acceleration = [
      //   action.payload.right ? state.me.acceleration : action.payload.left ? -state.me.acceleration : deceleration[0],
      //   action.payload.down ? state.me.acceleration : action.payload.up ? -state.me.acceleration : deceleration[1],
      // ];
      // const velocity = [state.me.render.velocity[0] + acceleration[0], state.me.render.velocity[1] + acceleration[1]];
      // state.me.render.velocity = [
      //   Math.abs(velocity[0]) < state.me.maxSpeed
      //     ? velocity[0]
      //     : velocity[0] > 0
      //     ? state.me.maxSpeed
      //     : -state.me.maxSpeed,
      //   Math.abs(velocity[1]) < state.me.maxSpeed
      //     ? velocity[1]
      //     : velocity[1] > 0
      //     ? state.me.maxSpeed
      //     : -state.me.maxSpeed,
      // ];
      state.me.render.velocity = [
        action.payload.right ? state.me.maxSpeed : action.payload.left ? -state.me.maxSpeed : 0,
        action.payload.down ? state.me.maxSpeed : action.payload.up ? -state.me.maxSpeed : 0,
      ];
      state.me.render.position = [
        state.me.render.position[0] + state.me.render.velocity[0],
        state.me.render.position[1] + state.me.render.velocity[1],
      ];
      state.me.state = state.me.render.velocity[0] === 0 && state.me.render.velocity[1] === 0 ? "idle" : "walk";
      state.me.direction = action.payload.right
        ? "right"
        : action.payload.left && state.me.character.left
        ? "left"
        : action.payload.up && state.me.character.up
        ? "up"
        : action.payload.down && state.me.character.down
        ? "down"
        : state.me.direction;
      if (action.payload.left && !state.me.character.left) state.me.render.flip = true;
      else if (action.payload.right) state.me.render.flip = false;
      const character = state.me.character as any;
      state.me.render.src = character[state.me.direction][state.me.state].url;
    },
    moveMe: (state: init.WorldState, action: PayloadAction<void>) => {
      if (!state.me) return;
      state.me.render.position = [
        state.me.render.position[0] + state.me.render.velocity[0],
        state.me.render.position[1] + state.me.render.velocity[1],
      ];
    },
    changeScreenSize: (state: init.WorldState, action: PayloadAction<types.Screen>) => {
      state.screen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initWorld.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initWorld.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(initWorld.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
