import styled from "styled-components";
import { Input, Select, Space } from "antd";
import { useEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const WebViewTool = () => {
  const { urlInput, setWebviewPurpose, webviewPurpose, setUrlInput, checkIsInputUrl } = useEditor();

  return (
    <Space direction="vertical">
      {/* <Input.Group compact style={{ width: "100%", marginBottom: 20 }}> */}
      <Select value={webviewPurpose} style={{ width: "100%" }} onChange={setWebviewPurpose}>
        <Select.Option value="default">default</Select.Option>
        <Select.Option value="youtube">youtube</Select.Option>
        <Select.Option value="image">image</Select.Option>
        <Select.Option value="twitter">twitter</Select.Option>
      </Select>
      <Input
        addonBefore={checkIsInputUrl(webviewPurpose) ? "URL" : "ID"}
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
      />
    </Space>
  );
};
