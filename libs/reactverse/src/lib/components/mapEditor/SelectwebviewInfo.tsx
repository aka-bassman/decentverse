import styled from "styled-components";
import { Card, Button } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoBox, SelectInfoButtons } from "./index";

export const SelectwebviewInfo = ({ data }: { data: types.TWebview }) => {
  const removeWebview = useEditor((state) => state.removeWebview);
  console.log("data", data);

  return (
    <StyledCard title="Interaction: WebPage" size="small">
      <div>
        <SelectInfoBox color="rgba(102, 102, 255, 0.5)" width={data.width} height={data.height} x={data.x} y={data.y} />
        <SelectInfoButtons remove={removeWebview} placeId={data.placeId} />
      </div>
      <div>purpose : {data.purpose}</div>
      <div>url : {data.url}</div>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 10px;
`;
