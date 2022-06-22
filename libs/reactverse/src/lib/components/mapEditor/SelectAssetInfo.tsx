import styled from "styled-components";
import { Card } from "antd";
import { useEditor, types } from "../../stores";
import { SelectInfoButtons } from "./index";

export const SelectAssetInfo = ({ data }: { data: types.TAsset }) => {
  const removeAsset = useEditor((state) => state.removeAsset);

  return (
    <StyledCard title="Asset" size="small">
      <div>
        <div className="asset-image">
          {data?.bottom && <img src={data.bottom} width={100} />}
          {data?.top && <img src={data.top} width={100} />}
          {data?.lighting && <img src={data.lighting} width={100} />}
        </div>
        <SelectInfoButtons remove={removeAsset} placeId={data.placeId} />
      </div>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 10px;
  .asset-image {
    position: relative;
    height: 150px;
    img {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-height: 190px;
      max-width: 190px;
    }
  }
`;
