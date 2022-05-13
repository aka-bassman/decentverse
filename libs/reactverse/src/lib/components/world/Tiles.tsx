import * as scalar from "../../stores/scalar.type";
export interface TileProps {
  tiles: scalar.Tile[][];
}

export const Tiles = ({ tiles }: TileProps) => {
  return (
    <>
      {tiles.map((tileArr) => (
        <div style={{ display: "flex" }}>
          {tileArr.map((tile) => (
            <div style={{ display: "flex" }}>
              <img src={tile.bottom.url} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
