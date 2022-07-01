import styled from "styled-components";
import { Card, Button, Menu, Dropdown, Space } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoBox, SelectInfoButtons, WebViewTool, EditInfoButtons } from "./index";
import { DeleteOutlined } from "@ant-design/icons";

export const SelectwebviewInfo = ({ data }: { data: types.TWebview }) => {
  const removeWebview = useEditor((state) => state.removeWebview);
  const toggleEditWebview = useEditor((state) => state.toggleEditWebview);
  const isEditWebview = useEditor((state) => state.isEditWebview);
  const modifyWebview = useEditor((state) => state.modifyWebview);
  const checkIsInputUrl = useEditor((state) => state.checkIsInputUrl);

  return (
    <StyledCard title="Interaction: WebPage" size="small">
      <SelectInfoBox color="rgba(102, 102, 255, 0.5)" width={data.width} height={data.height} x={data.x} y={data.y} />
      {isEditWebview ? (
        <>
          <div className="info">
            <WebViewTool />
          </div>
          <EditInfoButtons modify={modifyWebview} close={toggleEditWebview} placeId={data.placeId} />
        </>
      ) : (
        <>
          <div className="info">
            <p>purpose : {data.purpose}</p>
            <p>
              {checkIsInputUrl(data.purpose) ? "url" : "id"} : {data.url}
            </p>
            <p>message : {data.message}</p>
            <p>isEmbed : {data.isEmbed.toString()}</p>
          </div>
          <SelectInfoButtons remove={removeWebview} modify={toggleEditWebview} placeId={data.placeId} />
        </>
      )}
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 10px;
  .info {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    p {
      margin-bottom: 0;
      word-wrap: break-word;
    }
  }
`;
