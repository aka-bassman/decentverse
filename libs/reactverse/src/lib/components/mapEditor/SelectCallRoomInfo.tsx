import styled from "styled-components";
import { Card } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoBox, SelectInfoButtons, CallRoomTool, EditInfoButtons } from "./index";

export const SelectCallRoomInfo = ({ data }: { data: types.TCallRoom }) => {
  const removeCallRoom = useEditor((state) => state.removeCallRoom);
  const toggleEditCallRoom = useEditor((state) => state.toggleEditCallRoom);
  const isEditCallRoom = useEditor((state) => state.isEditCallRoom);
  const modifyCallRoom = useEditor((state) => state.modifyCallRoom);

  return (
    <StyledCard title="Interaction: CallRoom" size="small">
      <div>
        <SelectInfoBox color="rgba(54, 179, 160, 0.5)" width={data.width} height={data.height} x={data.x} y={data.y} />
        {isEditCallRoom ? (
          <>
            <div className="info">
              <CallRoomTool />
            </div>
            <EditInfoButtons modify={modifyCallRoom} close={toggleEditCallRoom} placeId={data.placeId} />
          </>
        ) : (
          <>
            <div className="info">
              <p>maxNum : {data.maxNum}</p>
            </div>
            <SelectInfoButtons remove={removeCallRoom} modify={toggleEditCallRoom} placeId={data.placeId} />
          </>
        )}
      </div>
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
