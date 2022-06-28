import styled from "styled-components";
import { Modal, Button, Space, Input, Radio, Col, Row, Select } from "antd";
import { useEditor } from "../../stores";

export const CharacterTool = () => {
  const isCharacterModalOpen = useEditor((state) => state.isCharacterModalOpen);
  const openCharacterModal = useEditor((state) => state.openCharacterModal);
  const closeCharacterModal = useEditor((state) => state.closeCharacterModal);
  const addCharacter = useEditor((state) => state.addCharacter);

  return (
    <div>
      <Button type="primary" block onClick={openCharacterModal}>
        Add Character
      </Button>

      <Modal
        title="Add Character"
        visible={isCharacterModalOpen}
        onOk={addCharacter}
        onCancel={closeCharacterModal}
        // okButtonProps={{ disabled: !validationTileCheck() }}
        width={1000}
      >
        <Row gutter={10}>
          <Col span={8}>캐릭터 목록, 캐릭터 추가</Col>
          <Col span={16}>
            <div>캐릭터명</div>
            <div>프로필 이미지</div>
            <div>스프라이트 이미지</div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
