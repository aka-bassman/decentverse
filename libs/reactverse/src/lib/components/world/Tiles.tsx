import * as scalar from "../../stores/scalar.type";
export interface TileProps {
  tiles: scalar.Tile[][];
}

export const Tiles = ({ tiles }: TileProps) => {
  return (
    <>
      {tiles.map((tileArr, idx) => (
        <div key={idx} style={{ display: "flex" }}>
          {tileArr.map((tile, idx) => (
            <div key={idx} style={{ display: "flex" }}>
              <img src={tile.bottom.url} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
