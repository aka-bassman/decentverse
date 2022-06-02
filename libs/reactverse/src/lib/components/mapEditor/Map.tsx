import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { useMapEditor } from "../../stores";

// const TILE_SIZE = 200;
// const TILE_WIDTH = TILE_SIZE * 8;
// const TILE_HEIGHT = TILE_SIZE * 5;

// const TILE_SIZE = 2000;
// const TILE_WIDTH = TILE_SIZE;
// const TILE_HEIGHT = TILE_SIZE;

export const Map = () => {
  const {
    isActiveViewMode,
    mapData,
    setCtxs,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
    tileSize,
    mapWidth,
    mapHeight,
  } = useMapEditor();

  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const assetCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const actionCanvasRef = useRef<HTMLCanvasElement>(null);

  const [assetContext, setAssetContext] = useState<any>();
  const [interactionContext, setInteractionContext] = useState<any>();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startXY, setStartXY] = useState([0, 0]);

  useEffect(() => {
    const mapCtx = mapCanvasRef.current?.getContext("2d");
    const assetCtx = assetCanvasRef.current?.getContext("2d");
    const interactionCtx = interactionCanvasRef.current?.getContext("2d");
    const actionCtx = actionCanvasRef.current?.getContext("2d");
    if (!mapCtx || !assetCtx || !interactionCtx || !actionCtx) return;
    setCtxs({ mapCtx, assetCtx, interactionCtx, actionCtx });
  }, []);

  //* 맵 초기화
  useEffect(() => {
    if (!mapData) return;
    const mapCanvas = mapCanvasRef.current;
    const mapContext = mapCanvas?.getContext("2d");

    //! 일단 [0][0] 만 진행
    const image = new Image();
    image.src = mapData.tiles[0][0].bottom.url;
    image.onload = () => {
      mapContext?.drawImage(image, 0, 0, tileSize, tileSize);
    };

    // for (let i = 0; i < 5; i++) {
    //   for (let j = 0; j < 8; j++) {
    //     const image = new Image();
    //     image.src = mapData.tiles[i][j].bottom.url;
    //     image.onload = () => {
    //       mapContext?.drawImage(image, j * tileSize, i * tileSize, tileSize, tileSize);
    //     };
    //   }
    // }
  }, [mapData]);

  //* 격자 초기화
  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const gridContext = gridCanvas?.getContext("2d");
    if (!gridContext) return;

    gridContext.strokeStyle = "black";
    gridContext.lineWidth = 1;

    for (let i = 1; i < 8; i++) {
      gridContext.beginPath();
      gridContext.moveTo(tileSize * i, 0);
      gridContext.lineTo(tileSize * i, mapHeight);
      gridContext.stroke();
    }

    for (let i = 1; i < 5; i++) {
      gridContext.beginPath();
      gridContext.moveTo(0, tileSize * i);
      gridContext.lineTo(mapWidth, tileSize * i);
      gridContext.stroke();
    }
  });

  //* 에셋
  // useEffect(() => {
  //   console.log("hi");
  //   const assetCanvas = assetCanvasRef.current;
  //   const assetContext = assetCanvas?.getContext("2d");
  //   setAssetContext(assetContext);

  //   const interactionCanvas = interactionCanvasRef.current;
  //   const interactionContext = interactionCanvas?.getContext("2d");
  //   setInteractionContext(interactionContext);
  // }, []);

  const addMapTile = ({ nativeEvent }: any) => {
    // console.log("nativeEvent", nativeEvent);
    const { offsetX, offsetY } = nativeEvent;
  };

  // const addAsset = ({ nativeEvent }: any) => {
  //   console.log("addAsset", nativeEvent);
  //   const { offsetX, offsetY } = nativeEvent;
  //   console.log("hi!!!");
  //   const image = new Image();
  //   image.src = "https://akamir.com/images/home/s4.gif";
  //   image.onload = () => {
  //     // const width = image.width > image.height ? MAX_CANVAS_WIDTH : (image.width * MAX_CANVAS_HEIGHT) / image.height;
  //     // const height = image.width > image.height ? (image.height * MAX_CANVAS_WIDTH) / image.width : MAX_CANVAS_HEIGHT;
  //     assetContext?.drawImage(image, offsetX, offsetY, 100, 100);
  //   };
  // };

  const addInteraction = ({ nativeEvent }: any) => {
    console.log("addInteraction", nativeEvent);
    const { offsetX, offsetY } = nativeEvent;
    setStartXY([offsetX, offsetY]);
  };

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;

    console.log("start", offsetX, offsetY);
    setStartXY([offsetX, offsetY]);
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;

    console.log("end");
    console.log("startXY[0], startXY[1]", startXY[0], startXY[1]);
    interactionContext.strokeRect(startXY[0], startXY[1], offsetX - startXY[0], offsetY - startXY[1]);
    setIsDrawing(false);
  };

  const drawing = ({ nativeEvent }: any) => {
    // console.log("drawing", nativeEvent);
    const { offsetX, offsetY } = nativeEvent;
    //canvas.getContext('2d')의 값이 있을 때
    if (interactionContext) {
      // interactionContext.clearRect();

      if (!isDrawing) {
        // interactionContext.beginPath();
        // interactionContext.moveTo(offsetX, offsetY);
      } else {
        // interactionContext.lineTo(offsetX, offsetY);
        // interactionContext.stroke();
      }
    }
  };

  return (
    <MapContainer>
      <canvas ref={mapCanvasRef} width={mapWidth} height={mapHeight} />
      <canvas ref={assetCanvasRef} width={mapWidth} height={mapHeight} />
      <canvas ref={interactionCanvasRef} width={mapWidth} height={mapHeight} />
      {isActiveViewMode("Grid") && <canvas ref={gridCanvasRef} width={mapHeight} height={mapHeight} />}
      <canvas
        ref={actionCanvasRef}
        width={mapWidth}
        height={mapHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </MapContainer>

    // return (
    //   <MapContainer>
    //     {isActiveViewMode("Grid") && (
    //       <canvas
    //         ref={gridCanvasRef}
    //         width={TILE_WIDTH}
    //         height={TILE_HEIGHT}
    //         style={{ position: "absolute", border: "1px solid black" }}
    //       />
    //     )}
    //     <canvas
    //       ref={mapCanvasRef}
    //       onMouseDown={addMapTile}
    //       width={TILE_WIDTH}
    //       height={TILE_HEIGHT}
    //       style={{ position: "absolute" }}
    //     />
    //      <canvas
    //       ref={assetCanvasRef}
    //       onMouseDown={addAsset}
    //       width={TILE_WIDTH}
    //       height={TILE_HEIGHT}
    //       style={{ position: "absolute" }}
    //     />
    //      <canvas
    //       ref={interactionCanvasRef}
    //       onMouseDown={addInteraction}
    //       width={TILE_WIDTH}
    //       height={TILE_HEIGHT}
    //       style={{ position: "absolute" }}
    //     />
    //     <canvas
    //       ref={interactionCanvasRef}
    //       width={TILE_WIDTH}
    //       height={TILE_HEIGHT}
    //       onMouseDown={startDrawing}
    //       onMouseUp={finishDrawing}
    //       onMouseMove={drawing}
    //       onMouseLeave={finishDrawing}
    //       style={{ position: "absolute" }}
    //     />
    //   </MapContainer>
  );
};

const MapContainer = styled.div`
  position: relative;
  canvas {
    position: absolute;
    border: 1px solid black;
  }
`;
