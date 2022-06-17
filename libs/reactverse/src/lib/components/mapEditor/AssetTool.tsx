import styled from "styled-components";
import { Segmented, Card } from "antd";
import { useEditor } from "../../stores";

export const AssetTool = () => {
  const { assetsData, selectedAssetId, setSelectedAssetId, subTool, setSubTool } = useEditor();

  return (
    <Card title="Assets" size="small">
      <Segmented block options={["Add", "Remove"]} value={subTool} onChange={(value) => setSubTool(value as string)} />
      {subTool === "Add" && (
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
      )}
    </Card>
  );
};

const AssetList = styled.div`
  max-height: 800px;
  overflow: scroll;
`;

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
