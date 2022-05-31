import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { useMapEditor } from "../../stores";

const TILE_SIZE = 200;
const TILE_WIDTH = TILE_SIZE * 8;
const TILE_HEIGHT = TILE_SIZE * 5;

export const Map = () => {
  const { isActiveViewMode } = useMapEditor();

  const canvasRef = useRef<any>(null);
  const gridCanvasRef = useRef<any>(null);

  const [context, setContext] = useState<any>();

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const gridContext = gridCanvas?.getContext("2d");
    if (!gridContext) return;

    gridContext.strokeStyle = "black";
    gridContext.lineWidth = 1;

    for (let i = 1; i < 8; i++) {
      gridContext.beginPath();
      gridContext.moveTo(TILE_SIZE * i, 0);
      gridContext.lineTo(TILE_SIZE * i, TILE_HEIGHT);
      gridContext.stroke();
    }

    for (let i = 1; i < 5; i++) {
      gridContext.beginPath();
      gridContext.moveTo(0, TILE_SIZE * i);
      gridContext.lineTo(TILE_WIDTH, TILE_SIZE * i);
      gridContext.stroke();
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    setContext(context);
  });

  const addMapTile = ({ nativeEvent }: any) => {
    console.log("nativeEvent", nativeEvent);
    const { offsetX, offsetY } = nativeEvent;
  };

  return (
    <MapContainer>
      {isActiveViewMode("Grid") && (
        <canvas
          ref={gridCanvasRef}
          width={TILE_WIDTH}
          height={TILE_HEIGHT}
          style={{ position: "absolute", border: "1px solid black" }}
        />
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={addMapTile}
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
        style={{ position: "absolute" }}
      />
    </MapContainer>
  );
};

const MapContainer = styled.div`
  position: relative;
`;
