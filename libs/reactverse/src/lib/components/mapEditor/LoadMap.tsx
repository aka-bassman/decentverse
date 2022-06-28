import React, { useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Modal } from "antd";
import { useEditor } from "../../stores";

export const LoadMap = () => {
  const init = useEditor((state) => state.init);
  const isLoadModalOpen = useEditor((state) => state.isLoadModalOpen);
  const toggleLoadModalOpen = useEditor((state) => state.toggleLoadModalOpen);
  const loadMapList = useEditor((state) => state.loadMapList);
  const mapList = useEditor((state) => state.mapList);

  useEffect(() => {
    if (!isLoadModalOpen) return;
    loadMapList();
  }, [isLoadModalOpen]);

  // useEffect(() => {
  //   //! TODO: 삭제
  //   init("62a3482360cb6ba7fa50e65c");
  // }, []);
  const loadMap = (mapId: string) => {
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
