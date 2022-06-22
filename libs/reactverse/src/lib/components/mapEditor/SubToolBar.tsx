import styled from "styled-components";
import { Button, Popover, Space } from "antd";
import { useEditor } from "../../stores";
import { ViewTool } from "./index";
import { EyeOutlined } from "@ant-design/icons";

export const SubToolBar = () => {
  const isEdited = useEditor((state) => state.isEdited);
  const saveMap = useEditor((state) => state.saveMap);

  return (
    <SubToolBarContainer>
      <Space direction="horizontal">
        <Popover placement="topLeft" title={"View mode"} content={ViewTool} trigger="click">
          <Button shape="circle" icon={<EyeOutlined />} />
        </Popover>

        <Button block className="save" disabled={!isEdited} onClick={saveMap}>
          SAVE
        </Button>
      </Space>
    </SubToolBarContainer>
  );
};

const SubToolBarContainer = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 4px 14px;
  text-align: right;
  z-index: 10;
`;
