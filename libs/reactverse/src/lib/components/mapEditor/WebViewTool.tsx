import styled from "styled-components";
import { Input, Button } from "antd";
import { useMapEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const WebViewTool = () => {
  const { isActiveViewMode, toggleViewMode } = useMapEditor();

  const handleOnChange = (e) => {
    e.preventDefault();

    console.log("e", e.target.value);
  };

  return (
    <div>
      <Input.Group compact style={{ width: "100%" }}>
        <Input addonBefore="URL" style={{ width: "calc(100% - 40px)" }} defaultValue="https://" />
        <Button type="primary" icon={<PlusOutlined />}></Button>
      </Input.Group>
    </div>
  );
};
