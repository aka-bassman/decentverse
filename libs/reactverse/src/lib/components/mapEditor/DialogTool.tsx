import styled from "styled-components";
import { Modal, Button, Space, Input, Radio, Col, Row, Select } from "antd";
import { useEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";
import { CharacterTool } from "./";

export const DialogTool = () => {
  const isDialogModalOpen = useEditor((state) => state.isDialogModalOpen);
  const toggleDialogModalOpen = useEditor((state) => state.toggleDialogModalOpen);
  const addDialog = useEditor((state) => state.addDialog);
  const characterNameInput = useEditor((state) => state.characterNameInput);
  const setCharacterNameInput = useEditor((state) => state.setCharacterNameInput);
  const addCharacter = useEditor((state) => state.addCharacter);
  const characters = useEditor((state) => state.characters);
  const inputFlowText = useEditor((state) => state.inputFlowText);
  const setInputFlowText = useEditor((state) => state.setInputFlowText);
  const inputAvatarPosition = useEditor((state) => state.inputAvatarPosition);
  const setInputAvatarPosition = useEditor((state) => state.setInputAvatarPosition);
  const selectedCharacterIndex = useEditor((state) => state.selectedCharacterIndex);
  const setSelectedCharacterIndex = useEditor((state) => state.setSelectedCharacterIndex);
  const addFlow = useEditor((state) => state.addFlow);
  const flows = useEditor((state) => state.flows);
  const inputTitle = useEditor((state) => state.inputTitle);
  const setInputTitle = useEditor((state) => state.setInputTitle);

  return (
    <div>
      <Button type="primary" block onClick={toggleDialogModalOpen}>
        Add Dialog
      </Button>

      <Modal
        title="Add Dialog"
        visible={isDialogModalOpen}
        onOk={addDialog}
        onCancel={toggleDialogModalOpen}
        // okButtonProps={{ disabled: !validationTileCheck() }}
        width={1000}
      >
        <Input
          addonBefore="Title"
          style={{ width: "100%" }}
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <input />
        <Row gutter={10}>
          <Col span={8}>
            <CharacterTool />
            {/* <Input.Group compact style={{ width: "100%", marginBottom: 20 }}>
              <Input
                addonBefore="name"
                style={{ width: "calc(100% - 40px)" }}
                value={characterNameInput}
                onChange={(e) => setCharacterNameInput(e.target.value)}
              />
              <Button onClick={addCharacter} type="primary" icon={<PlusOutlined />}></Button>
            </Input.Group>
            {characters
              .filter((_, index) => index > 0)
              .map((cur, index) => (
                <div key={index}>
                  {cur.name}
                  <span style={{ marginLeft: 10 }}>이미지 추가</span>
                  <span style={{ marginLeft: 10 }}>디폴트 위치</span>
                </div>
              ))}
               */}
            <hr />
            <div>
              인물외 이미지 추가
              <input
                type="file"
                onChange={(e) => {
                  console.log();
                }}
              />
            </div>
            {/* 
            <Modal
              title="Add Character"
              visible={isDialogModalOpen}
              onOk={addDialog}
              onCancel={toggleDialogModalOpen}
              // okButtonProps={{ disabled: !validationTileCheck() }}
              width={500}
            >
              hi!
            </Modal> */}
          </Col>
          <Col span={16}>
            <div style={{ backgroundColor: "#eee", padding: 10, borderRadius: 10 }}>
              <div style={{ height: 300, overflowY: "scroll" }}>
                {flows.map((cur, index) => (
                  <div key={index} style={{ backgroundColor: "#ddd", marginBottom: 10, padding: 4 }}>
                    <div>
                      <span style={{ marginRight: 10 }}>{characters[cur.characterIndex].name}</span>
                      <span>{cur.avatarPositions}</span>
                    </div>
                    <div>{cur.text}</div>
                  </div>
                ))}
              </div>
              <div>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space>
                    <Select style={{ width: 120 }} value={selectedCharacterIndex} onChange={setSelectedCharacterIndex}>
                      {characters.map((cur, index) => (
                        <Select.Option key={index} value={index}>
                          {cur.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Select style={{ width: 120 }} value={inputAvatarPosition} onChange={setInputAvatarPosition}>
                      <Select.Option value="left">left</Select.Option>
                      <Select.Option value="right">right</Select.Option>
                      <Select.Option value="center">center</Select.Option>
                    </Select>
                    {/* <Select style={{ width: 120 }} value={inputAvatarPosition} onChange={setInputAvatarPosition}>
                <Select.Option value="left">left</Select.Option>
                <Select.Option value="right">right</Select.Option>
                <Select.Option value="center">center</Select.Option>
              </Select> */}
                    이미지 선택
                  </Space>
                  <Input.TextArea
                    value={inputFlowText}
                    onChange={(e) => setInputFlowText(e.target.value)}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                  <Button type="primary" onClick={addFlow} block>
                    Add
                  </Button>
                </Space>
              </div>
              <Space style={{ marginTop: 10 }}>
                <div className="label">{/* <span>*</span>Bottom */}</div>
                {/* <input type="file" onChange={(e) => handleImageUpload(e, "bottom")} /> */}
              </Space>
              <Space style={{ marginTop: 10 }}>
                {/* <div className="label">Top</div> */}
                {/* <input type="file" onChange={(e) => handleImageUpload(e, "top")} /> */}
              </Space>
              {/* </FileForm> */}
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
