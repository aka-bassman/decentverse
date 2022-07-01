import styled from "styled-components";
import { Segmented, Card } from "antd";
import { useEditor } from "../../stores";

export const AssetTool = () => {
  const assetsData = useEditor((state) => state.assetsData);
  const selectedAssetId = useEditor((state) => state.selectedAssetId);
  const setSelectedAssetId = useEditor((state) => state.setSelectedAssetId);

  return (
    <StyledCard title="Assets" size="small">
      <AssetList>
        {assetsData?.map((asset) => (
          <AssetItem
            key={asset.id}
            onClick={() => setSelectedAssetId(asset.id)}
            className={selectedAssetId === asset.id ? "active" : ""}
          >
            {asset?.bottom?.url && <img src={asset.bottom.url} />}
            {asset?.top?.url && <img src={asset.top.url} />}
            {asset?.lighting?.url && <img src={asset.lighting.url} />}
          </AssetItem>
        ))}
      </AssetList>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  height: auto;
  flex-grow: 1;
  overflow: scroll;
`;

const AssetList = styled.div``;

const AssetItem = styled.div`
  position: relative;
  height: 200px;
  cursor: pointer;
  &.active {
    background-color: #ddd;
    border-radius: 30px;
  }
  img {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 190px;
    max-width: 190px;
  }
`;
