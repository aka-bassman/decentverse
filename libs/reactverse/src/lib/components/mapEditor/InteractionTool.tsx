import styled from "styled-components";
import { Card, Radio } from "antd";
import { useEditor } from "../../stores";
import { WebViewTool, CallRoomTool } from "./";

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
          className="radio-buttons"
        >
          <Radio.Button value="collision">Collision</Radio.Button>
          <Radio.Button value="webview">WebPage</Radio.Button>
          <Radio.Button value="callRoom">CallRoom</Radio.Button>
        </Radio.Group>
        {interactionTool === "webview" && <WebViewTool />}
        {interactionTool === "callRoom" && <CallRoomTool />}
      </OptionArea>
    </Card>
  );
};

const OptionArea = styled.div`
  margin-top: 20px;
  .ant-radio-group {
    margin-bottom: 10px;
  }
  .radio-buttons {
    width: 100%;
    margin-bottom: 20px;
  }
  .ant-radio-button-wrapper {
    width: 33.3333%;
    text-align: center;
  }
`;
