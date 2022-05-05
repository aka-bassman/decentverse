export const characterStateTypes = [
  'LEFTIDLE',
  'RIGHTIDLE',
  'UPIDLE',
  'DOWNIDLE',
  'LEFTMOVE',
  'RIGHTMOVE',
  'UPMOVE',
  'DOWNMOVE',
] as const;
export type CharacterStateType = typeof characterStateTypes[number];
export const CHARSTATE: { [key in CharacterStateType]: number } = {
  LEFTIDLE: 1,
  RIGHTIDLE: 2,
  UPIDLE: 3,
  DOWNIDLE: 4,
  LEFTMOVE: 5,
  RIGHTMOVE: 6,
  UPMOVE: 7,
  DOWNMOVE: 8,
} as const;
// export type CharacterState =
export interface CharacterData {
  id: string;
  x: number;
  y: number;
  state: typeof CHARSTATE[CharacterStateType];
}
