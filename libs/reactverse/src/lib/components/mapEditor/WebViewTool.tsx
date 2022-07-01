import styled from "styled-components";
import { Input, Select, Space, Switch } from "antd";
import { useEditor, useGame } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const WebViewTool = () => {
  const urlInput = useEditor((state) => state.urlInput);
  const setWebviewPurpose = useEditor((state) => state.setWebviewPurpose);
  const webviewPurpose = useEditor((state) => state.webviewPurpose);
  const setUrlInput = useEditor((state) => state.setUrlInput);
  const checkIsInputUrl = useEditor((state) => state.checkIsInputUrl);
  const isUrlInputError = useEditor((state) => state.isUrlInputError);
  const webviewMessage = useEditor((state) => state.webviewMessage);
  const webviewIsEmbed = useEditor((state) => state.webviewIsEmbed);
  const setWebviewMessage = useEditor((state) => state.setWebviewMessage);
  const setWebviewIsEmbed = useEditor((state) => state.setWebviewIsEmbed);
  const lockKey = useGame((state) => state.lockKey);

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
        onFocus={() => lockKey(true)}
        onBlur={() => lockKey(false)}
      />
      <Input
        addonBefore="Message"
        value={webviewMessage}
        onChange={(e) => setWebviewMessage(e.target.value)}
        onFocus={() => lockKey(true)}
        onBlur={() => lockKey(false)}
      />
      <Space>
        isEmbed <Switch checked={webviewIsEmbed} onChange={setWebviewIsEmbed} />
      </Space>
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
