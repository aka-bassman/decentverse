import * as scalar from "../../stores/scalar.type";
import * as types from "../../stores/types";
export interface PlayerProps {
  player: types.Player;
}

export const Player = ({ player }: PlayerProps) => {
  return <img src={player.character.right.idle.url} />;
};
