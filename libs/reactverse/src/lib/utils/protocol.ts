import { types, scalar } from "../stores";
export type PlayerProtocol = {
  id: string;
  nickname: string;
  position: number[];
  velocity: number[];
  state: types.PlayerState;
  direction: types.Direction;
  chatText: string;
  isTalk: boolean;
};
export type Scope = {
  min: number[];
  max: number[];
};
export const encodeProtocolV1 = (p: PlayerProtocol, s: Scope) => {
  const encodedPosition = convToScore(Math.floor(p.position[0]), Math.floor(p.position[1]));
  const min = convToScore(s.min[0], s.min[1]);
  const max = convToScore(s.max[0], s.max[1]);
  const encodedData = `${p.id}\t${p.nickname}\t${Math.floor(p.position[0])}\t${Math.floor(p.position[1])}\t${
    p.velocity[0]
  }\t${p.velocity[1]}\t${p.state}\t${p.direction}\t${p.chatText}\t${p.isTalk}`;
  return [p.id, encodedPosition, encodedData, min, max];
};
export const decodeProtocolV1 = (data: string): PlayerProtocol => {
  const message = data.split("\t");
  return {
    id: message[0],
    nickname: message[1],
    position: [parseInt(message[2]), parseInt(message[3])],
    velocity: [parseInt(message[4]), parseInt(message[5])],
    state: message[6] as types.PlayerState,
    direction: message[7] as types.Direction,
    chatText: message[8],
    isTalk: message[9] === "true",
  };
};
const convToScore = (x: number, y: number, maxDigits = 16) => {
  const base = new Array(maxDigits).fill("0").join("");
  const [xbin, ybin] = [x.toString(2), y.toString(2)];
  const [xstr, ystr] = [base.substring(xbin.length) + xbin, base.substring(ybin.length) + ybin];
  return new Array(maxDigits)
    .fill(0)
    .map((_, idx) => xstr[idx] + ystr[idx])
    .join("");
};

const binAscs = new Array(30).fill(1).map((_, idx) => 2 ** idx);
const binDescs = new Array(...binAscs).reverse();
export const makeScope = (scope: types.WorldScope): types.WorldScope => {
  const target = [Math.min(...scope.min), Math.max(...scope.max)];
  const [min, max] = [binDescs.find((bin) => bin <= target[0]) ?? 0, binAscs.find((bin) => bin >= target[1]) ?? 2 ^ 30];
  return { min: [min, min], max: [max, max] };
  // return { min: [45000, 45000], max: [50000, 50000] };
};

export const makeCharacterMessage = (user: types.User, character: types.Character) => {
  return JSON.stringify({ user, character });
};
