import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, Space, Row, Col, Segmented, Card, List, Checkbox } from "antd";
import { useMapEditor, TMainTool } from "../../stores";

export const SideToolBar = () => {
  const {
    isActiveViewMode,
    toggleViewMode,
    assetsData,
    mainTool,
    setMainTool,
    selectedAssetId,
    setSelectedAssetId,
    subTool,
    setSubTool,
    isEdited,
  } = useMapEditor();

  const data = [
    {
      id: 1,
      title: "Map Title #1",
    },
    {
      id: 2,
      title: "Map Title #2",
    },
    {
      id: 3,
      title: "Map Title #3",
    },
    {
      id: 4,
      title: "Map Title #4",
    },
  ];

  return (
    <SideToolBarContainer>
      <Button block style={{ marginBottom: 10 }} disabled={!isEdited}>
        SAVE
      </Button>
      <Segmented
        block
        // options={["Map", "Assets", "Interaction"]}
        options={["Assets", "Interaction"]}
        onChange={(value) => setMainTool(value as TMainTool)}
      />
      {/* <Row gutter={0}>
        <Col className="gutter-row" span={8}>
          <Button block>Map</Button>
        </Col>
        <Col className="gutter-row" span={8}>
          <Button block>Assets</Button>
        </Col>
        <Col className="gutter-row" span={8}>
          <Button block>Interaction</Button>
        </Col>
      </Row> */}
      <ToolContainer>
        {mainTool === "Map" && (
          <Card title="Map" size="small">
            {/* <Button size="small" block>
              <EditOutlined />
              추가
            </Button> */}
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item onClick={() => console.log("item.id", item.id)} style={{ cursor: "pointer" }}>
                  <List.Item.Meta
                    // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.title}
                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
        {mainTool === "Assets" && (
          <Card title="Assets" size="small">
            <Segmented
              block
              options={["Add", "Remove"]}
              value={subTool}
              onChange={(value) => setSubTool(value as string)}
            />
            {subTool === "Add" && (
              <AssetList>
                {assetsData?.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    style={selectedAssetId === asset.id ? { border: "1px solid black" } : {}}
                  >
                    <div>bottom: {asset?.bottom?.url && <img src={asset?.bottom?.url} width={100} height={100} />}</div>
                    <div>top: {asset?.top?.url && <img src={asset?.top?.url} width={100} height={100} />}</div>
                    <div></div>
                  </div>
                ))}
              </AssetList>
            )}
            {/* <Button size="small" block>
              <EditOutlined />
              추가
            </Button>
            <Button size="small" block>
              <DeleteOutlined />
              요소삭제
            </Button>
            <Button size="small" block>
              <CopyOutlined />
              요소복사
            </Button> */}
          </Card>
        )}
        {mainTool === "Interaction" && (
          <Card title="Interaction" size="small">
            <Button size="small" block>
              <EditOutlined />
              추가
            </Button>
          </Card>
        )}
      </ToolContainer>
      <hr />
      <Card title="View mode" size="small">
        <div>
          <div>
            <Checkbox onChange={() => toggleViewMode("Grid")} checked={isActiveViewMode("Grid")}>
              Grid
            </Checkbox>
          </div>
          <div>
            <Checkbox onChange={() => toggleViewMode("Interaction")} checked={isActiveViewMode("Interaction")}>
              Interaction
            </Checkbox>
          </div>
          <div>
            <Checkbox onChange={() => toggleViewMode("Top")} checked={isActiveViewMode("Top")}>
              Top
            </Checkbox>
          </div>
          <div>
            <Checkbox onChange={() => toggleViewMode("Bottom")} checked={isActiveViewMode("Bottom")}>
              Bottom
            </Checkbox>
          </div>
        </div>
      </Card>
    </SideToolBarContainer>
  );
};

const SideToolBarContainer = styled.div``;
const ToolContainer = styled.div`
  margin-top: 10px;
`;

const AssetList = styled.div`
  max-height: 400px;
  overflow: scroll;
`;
