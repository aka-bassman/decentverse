import styled from "styled-components";
import { Segmented, Card, Radio } from "antd";
import { useEditor } from "../../stores";
import { WebViewTool, CallRoomTool, TalkTool } from "./";

export const InteractionTool = () => {
  const interactionTool = useEditor((state) => state.interactionTool);
  const setInteractionTool = useEditor((state) => state.setInteractionTool);

  return (
    <Card title="Interaction" size="small">
      <OptionArea>
        <Radio.Group
          value={interactionTool}
          onChange={(e) => setInteractionTool(e.target.value)}
          size="small"
          buttonStyle="solid"
        >
          <Radio.Button value="collision">Collision</Radio.Button>
          <Radio.Button value="webview">WebPage</Radio.Button>
          <Radio.Button value="callRoom">CallRoom</Radio.Button>
          <Radio.Button value="talk">Talk</Radio.Button>
        </Radio.Group>
        {interactionTool === "webview" && <WebViewTool />}
        {interactionTool === "callRoom" && <CallRoomTool />}
        {interactionTool === "talk" && <TalkTool />}
      </OptionArea>
    </Card>
  );
};

const OptionArea = styled.div`
  margin-top: 20px;
  .ant-radio-group {
    margin-bottom: 10px;
  }
`;
