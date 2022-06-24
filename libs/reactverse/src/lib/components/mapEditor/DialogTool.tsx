import styled from "styled-components";
import { Modal, Button, Space, Input, Radio, Col, Row } from "antd";
import { useEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const DialogTool = () => {
  const isScriptModalOpen = useEditor((state) => state.isScriptModalOpen);
  const toggleScriptModalOpen = useEditor((state) => state.toggleScriptModalOpen);
  const addScript = useEditor((state) => state.addScript);
  const characterNameInput = useEditor((state) => state.characterNameInput);
  const setCharacterNameInput = useEditor((state) => state.setCharacterNameInput);
  const addCharacter = useEditor((state) => state.addCharacter);
  const characters = useEditor((state) => state.characters);

  return (
    <div>
      <Button type="primary" block onClick={toggleScriptModalOpen}>
        Add Dialog
      </Button>

      <Modal
        title="Add Dialog"
        visible={isScriptModalOpen}
        onOk={addScript}
        onCancel={toggleScriptModalOpen}
        // okButtonProps={{ disabled: !validationTileCheck() }}
        width={1000}
      >
        <Row>
          <Col span={8}>
            <Input.Group compact style={{ width: "100%", marginBottom: 20 }}>
              <Input
                addonBefore="name"
                style={{ width: "calc(100% - 40px)" }}
                value={characterNameInput}
                onChange={(e) => setCharacterNameInput(e.target.value)}
              />
              <Button onClick={addCharacter} type="primary" icon={<PlusOutlined />}></Button>
            </Input.Group>
            {
              // <Radio.Group onChange={(e) => selectUrl(e.target.value)} value={selectedUrl}>
              <Radio.Group>
                <Space direction="vertical">
                  {characters.map((cur, index) => (
                    <Radio value={index}>{cur.name}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            }
          </Col>
          <Col span={16}>
            <Space style={{ marginTop: 10 }}>
              <div className="label">{/* <span>*</span>Bottom */}</div>
              {/* <input type="file" onChange={(e) => handleImageUpload(e, "bottom")} /> */}
            </Space>
            <Space style={{ marginTop: 10 }}>
              {/* <div className="label">Top</div> */}
              {/* <input type="file" onChange={(e) => handleImageUpload(e, "top")} /> */}
            </Space>
            {/* </FileForm> */}
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
