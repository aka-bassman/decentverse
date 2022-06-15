import styled from "styled-components";
import { Card, Modal, InputNumber, Button, Input, Space } from "antd";
import { useMapEditor } from "../../stores";
import { useState, useEffect } from "react";

export const NewMap = () => {
  const {
    isNewModalOpen,
    toggleNewModalOpen,
    inputName,
    inputTileSize,
    updateName,
    updateTileSize,
    validationCheck,
    createMap,
  } = useMapEditor().mapTool;

  return (
    <>
      <Button block onClick={toggleNewModalOpen}>
        New
      </Button>
      <Modal
        title="New Map"
        visible={isNewModalOpen}
        onOk={createMap}
        onCancel={toggleNewModalOpen}
        okButtonProps={{ disabled: !validationCheck() }}
      >
        <Space style={{ marginTop: 10 }}>
          <Input addonBefore="name" value={inputName} onChange={(e) => updateName(e.target.value)} />

          <InputNumber
            addonBefore="tile size"
            value={inputTileSize}
            onChange={(value) => updateTileSize(value)}
            disabled
          />
        </Space>
      </Modal>
    </>
  );
};
