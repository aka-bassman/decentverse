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
              <img
                src={
                  "https://media.discordapp.net/attachments/975326008951578674/975326520660869160/3.png?width=1811&height=1358"
                }
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
