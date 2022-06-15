import React, { useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Modal } from "antd";
import { useMapEditor } from "../../stores";

export const LoadMap = () => {
  const { init } = useMapEditor();
  const { isLoadModalOpen, toggleLoadModalOpen, loadMapList, mapList } = useMapEditor().mapTool;

  useEffect(() => {
    if (!isLoadModalOpen) return;
    loadMapList();
  }, [isLoadModalOpen]);

  const loadMap = (mapId: string) => {
    console.log("ok", mapId);
    init(mapId);
  };

  return (
    <>
      <Button block onClick={toggleLoadModalOpen}>
        Load
      </Button>
      <Modal title="Load Map" visible={isLoadModalOpen} footer={null} onCancel={toggleLoadModalOpen}>
        {mapList.map((map) => (
          <MapItem key={map.id} onClick={() => loadMap(map.id)}>
            {map.name}
          </MapItem>
        ))}
      </Modal>
    </>
  );
};

const MapItem = styled.div`
  position: relative;
  height: 40px;
  border: 1px solid #ddd;
  padding: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;