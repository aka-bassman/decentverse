import styled from "styled-components";
import { Input, Select, Space } from "antd";
import { useEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const WebViewTool = () => {
  const urlInput = useEditor((state) => state.urlInput);
  const setWebviewPurpose = useEditor((state) => state.setWebviewPurpose);
  const webviewPurpose = useEditor((state) => state.webviewPurpose);
  const setUrlInput = useEditor((state) => state.setUrlInput);
  const checkIsInputUrl = useEditor((state) => state.checkIsInputUrl);
  const isUrlInputError = useEditor((state) => state.isUrlInputError);

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
      {isUrlInputError && (
        <ErrorMessage>* That's not a valid {checkIsInputUrl(webviewPurpose) ? "URL" : "ID"}</ErrorMessage>
      )}
    </Space>
  );
};

const ErrorMessage = styled.div`
  color: #ff6666;
  font-size: 12px;
`;
