import { Suspense, useRef, MutableRefObject, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3 } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
export interface MapProp {
  player: MutableRefObject<RenderCharacter>;
  scope: MutableRefObject<types.WorldScope>;
}

export const TileMap = ({ player, scope }: MapProp) => {
  const tileMap = useGame((state) => state.tileMap);
  const screen = useGame((state) => state.screen);
  const render = useGame((state) => state.render);
  const setTiles = useGame((state) => state.setTiles);
  const tileStatus = useRef({ state: [-5, -5], idx: [0, 0] });
  const renderTiles = useWorld((state) => state.render.tiles);
  const scene = useRef<Scene>(new Scene());
  // const renderLines = useMemo(
  //   () => [
  //     [
  //       tileMap.tileSize[0] * tileMap.renderLimit[0],
  //       tileMap.tileSize[0] * tileMap.derenderLimit[0],
  //       tileMap.tileSize[0] * (1 - tileMap.derenderLimit[0]),
  //       tileMap.tileSize[0] * (1 - tileMap.renderLimit[0]),
  //       tileMap.tileSize[0],
  //     ],
  //     [
  //       tileMap.tileSize[1] * tileMap.renderLimit[1],
  //       tileMap.tileSize[1] * tileMap.derenderLimit[1],
  //       tileMap.tileSize[1] * (1 - tileMap.derenderLimit[1]),
  //       tileMap.tileSize[1] * (1 - tileMap.renderLimit[1]),
  //       tileMap.tileSize[1],
  //     ],
  //   ],
  //   []
  // );
  // useInterval(() => {
  //   // 1. Update Tiles
  //   const tilePos = [
  //     player.current.position[0] % tileMap.tileSize[0],
  //     player.current.position[1] % tileMap.tileSize[1],
  //   ];
  //   const state = [
  //     renderLines[0].findIndex((line) => tilePos[0] < line) - 2,
  //     renderLines[1].findIndex((line) => tilePos[1] < line) - 2,
  //   ];
  //   if (tileStatus.current.state[0] === state[0] && tileStatus.current.state[1] === state[1]) return;
  //   const tileIdx = [
  //     Math.floor(player.current.position[0] / tileMap.tileSize[0]),
  //     Math.floor(player.current.position[1] / tileMap.tileSize[1]),
  //   ];
  //   const tiles = [[...render.tiles[0]], [...render.tiles[1]]];
  //   state.map((st, idx) => {
  //     if (st === -2) tiles[idx][0] = Math.max(tileIdx[idx] - 1, 0);
  //     else if (st === 2) tiles[idx][1] = Math.min(tileIdx[idx] + 2, tileMap.maxTileNum[idx] + 1);
  //     else if (st === 0) tiles[idx] = [tileIdx[idx], tileIdx[idx] + 1];
  //   });
  //   tileStatus.current.state = state;
  //   if (tileStatus.current.idx[0] !== tileIdx[0] || tileStatus.current.idx[1] !== tileIdx[1]) {
  //     tileStatus.current.idx = tileIdx;
  //     return;
  //   }
  //   setTiles(tiles);

  //   // 2. Update Scope
  //   const showBox = {
  //     min: [player.current.position[0] - screen.size[0], player.current.position[1] - screen.size[1]],
  //     max: [player.current.position[0] + screen.size[0], player.current.position[1] + screen.size[1]],
  //   };
  //   scope.current = makeScope(showBox);
  // }, 500);
  return (
    <Suspense fallback={null}>
      {renderTiles
        // .slice(...render.tiles[1])
        .map((tileArr, idxy) =>
          tileArr
            // .slice(...render.tiles[0])
            .map((tile, idxx) => {
              const x = idxx + render.tiles[0][0];
              const y = idxy + render.tiles[1][0];
              const offsetX = tileMap.tileSize[0] / 2 + (idxx + render.tiles[0][0]) * tileMap.tileSize[0];
              const offsetY = tileMap.tileSize[1] / 2 + (idxy + render.tiles[1][0]) * tileMap.tileSize[1];
              return <Tile key={`${x}/${y}`} x={x} y={y} offsetX={offsetX} offsetY={offsetY} />;
            })
        )}
    </Suspense>
  );
};
