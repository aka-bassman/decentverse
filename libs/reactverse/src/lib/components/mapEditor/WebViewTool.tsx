import styled from "styled-components";
import { Input, Button, Radio, Space } from "antd";
import { useMapEditor } from "../../stores";
import { PlusOutlined } from "@ant-design/icons";

export const WebViewTool = () => {
  const { urlInput, urls, selectedUrl, setUrlInput, addUrl, selectUrl } = useMapEditor().webviewTool;

  return (
    <div>
      <Input.Group compact style={{ width: "100%", marginBottom: 20 }}>
        <Input
          addonBefore="URL"
          style={{ width: "calc(100% - 40px)" }}
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Button onClick={addUrl} type="primary" icon={<PlusOutlined />}></Button>
      </Input.Group>
      <Radio.Group onChange={(e) => selectUrl(e.target.value)} value={selectedUrl}>
        <Space direction="vertical">
          {urls.map((cur) => (
            <Radio value={cur.url}>{cur.url}</Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};
