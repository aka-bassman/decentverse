import styled from "styled-components";
import { Card, Modal, InputNumber, Button, Input, Space } from "antd";
import { useEditor } from "../../stores";
import { useState, useEffect } from "react";

export const NewMap = () => {
  const { isNewModalOpen, toggleNewModalOpen, inputName, updateName, validationMapCheck, createMap } = useEditor();

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
        okButtonProps={{ disabled: !validationMapCheck() }}
      >
        <Space style={{ marginTop: 10 }}>
          <Input addonBefore="name" value={inputName} onChange={(e) => updateName(e.target.value)} />
        </Space>
      </Modal>
    </>
  );
};
