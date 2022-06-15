import styled from "styled-components";
import { Modal, Button, Space } from "antd";
import { useMapEditor } from "../../stores";

export const AddTiles = () => {
  const { isTilesModalOpen, toggleTilesModalOpen, addMapFile, addTiles, validationCheck } = useMapEditor().tileTool;
  const { mapData } = useMapEditor();

  const handleImageUpload = (e: any, type: "bottom" | "top" | "lighting") => {
    const files = e.target.files;
    if (!files || files.length !== 1) return;
    addMapFile(files[0], type);
  };

  if (!mapData) return null;

  return (
    <>
      <Button type="primary" block onClick={toggleTilesModalOpen}>
        Add Tiles
      </Button>

      <Modal
        title={`Add Tiles: ${mapData.name} `}
        visible={isTilesModalOpen}
        onOk={addTiles}
        onCancel={toggleTilesModalOpen}
        okButtonProps={{ disabled: !validationCheck() }}
      >
        <Space style={{ marginTop: 10 }}>
          bottom:
          <input type="file" multiple onChange={(e) => handleImageUpload(e, "bottom")} />
        </Space>
      </Modal>
    </>
  );
};
