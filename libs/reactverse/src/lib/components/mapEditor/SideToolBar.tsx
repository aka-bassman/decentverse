import styled from "styled-components";
import { Button, Segmented, Space } from "antd";
import { useEditor, TMainTool } from "../../stores";
import { MapTool, AssetTool, InteractionTool, ViewTool } from "./index";

export const SideToolBar = () => {
  const { mainTool, setMainTool, isEdited, saveMap, mapData } = useEditor();

  return (
    <SideToolBarContainer>
      <MapTool />
      {!!mapData?.tiles?.length && (
        <>
          <Button block style={{ marginBottom: 10 }} disabled={!isEdited} onClick={saveMap}>
            SAVE
          </Button>
          <Segmented
            block
            options={["Assets", "Interaction"]}
            value={mainTool}
            onChange={(value) => setMainTool(value as TMainTool)}
          />
          <ToolContainer>
            {mainTool === "Assets" && <AssetTool />}
            {mainTool === "Interaction" && <InteractionTool />}
          </ToolContainer>
          <ViewTool />
        </>
      )}
    </SideToolBarContainer>
  );
};

const SideToolBarContainer = styled.div``;
const ToolContainer = styled.div`
  margin-top: 10px;
`;
