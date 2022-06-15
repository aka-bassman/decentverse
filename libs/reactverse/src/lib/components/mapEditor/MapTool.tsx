import styled from "styled-components";
import { Card, Popconfirm, Descriptions, Button } from "antd";
import { useMapEditor } from "../../stores";
import { NewMap, LoadMap, AddTiles } from "./index";

export const MapTool = () => {
  const { mapData } = useMapEditor();
  const { closeMap } = useMapEditor().mapTool;

  if (!mapData)
    return (
      <Card title="Map" size="small" style={{ marginBottom: 20 }}>
        <NewMap />
        <LoadMap />
      </Card>
    );

  return (
    <Card title={`Map: ${mapData.name}`} size="small" style={{ marginBottom: 20 }}>
      {mapData.tiles.length ? (
        <div>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="tiles">
              {mapData.tiles.length} X {mapData.tiles[0].length}
            </Descriptions.Item>
            <Descriptions.Item label="tile size">{mapData.tileSize}px</Descriptions.Item>
          </Descriptions>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Popconfirm title="Are you sure？" placement="bottomRight" onConfirm={closeMap}>
              <a href="#">Close</a>
            </Popconfirm>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <AddTiles />
            <Popconfirm title="Are you sure？" placement="bottomRight" onConfirm={closeMap}>
              <a href="#">Close</a>
            </Popconfirm>
          </div>
        </div>
      )}
    </Card>
  );
};
