export interface GameState {
  time: number;
  me: {
    src: string;
    flip: boolean;
    position: number[];
    velocity: number[];
    state: "idle" | "walk";
    direction: "left" | "right" | "up" | "down";
  };
}
