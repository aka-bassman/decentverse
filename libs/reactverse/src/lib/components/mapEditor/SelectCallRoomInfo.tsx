import styled from "styled-components";
import { Card } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoBox, SelectInfoButtons } from "./index";

export const SelectCallRoomInfo = ({ data }: { data: types.TCallRoom }) => {
  const removeCallRoom = useEditor((state) => state.removeCallRoom);
  return (
    <StyledCard title="Interaction: CallRoom" size="small">
      <div>
        <SelectInfoBox color="rgba(54, 179, 160, 0.5)" width={data.width} height={data.height} x={data.x} y={data.y} />
        <div>maxNum : {data.maxNum}</div>

        <SelectInfoButtons remove={removeCallRoom} placeId={data.placeId} />
      </div>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 10px;
`;
