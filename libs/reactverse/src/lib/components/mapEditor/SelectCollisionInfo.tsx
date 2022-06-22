import styled from "styled-components";
import { Card } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoButtons, SelectInfoBox } from "./index";

export const SelectCollisionInfo = ({ data }: { data: types.TCollision }) => {
  const removeCollision = useEditor((state) => state.removeCollision);

  return (
    <StyledCard title="Interaction: Collision" size="small">
      <div>
        <SelectInfoBox color="rgba(255, 102, 102, 0.5)" width={data.width} height={data.height} x={data.x} y={data.y} />
        <SelectInfoButtons remove={removeCollision} placeId={data.placeId} />
      </div>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 10px;
`;
