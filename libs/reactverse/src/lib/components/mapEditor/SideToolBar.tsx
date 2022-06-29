import styled from "styled-components";
import { Segmented } from "antd";
import { useEditor, TMainTool, TEditMode } from "../../stores";
import { MapTool, AssetTool, InteractionTool, SelectInfo, DialogTool } from "./index";

export const SideToolBar = () => {
  const mainTool = useEditor((state) => state.mainTool);
  const setMainTool = useEditor((state) => state.setMainTool);
  const mapData = useEditor((state) => state.mapData);
  const editMode = useEditor((state) => state.editMode);
  const setEditMode = useEditor((state) => state.setEditMode);

  return (
    <SideToolBarContainer>
      <MapTool />
      {!!mapData?.tiles?.length && (
        <>
          <Segmented
            className="edit-mode-button"
            block
            options={["Select", "Add"]}
            value={editMode}
            onChange={(value) => setEditMode(value as TEditMode)}
          />

          {editMode === "Add" ? (
            <>
              <Segmented
                block
                options={["Assets", "Interaction", "Dialog"]}
                value={mainTool}
                onChange={(value) => setMainTool(value as TMainTool)}
              />
              <div className="tool-container">
                {mainTool === "Assets" && <AssetTool />}
                {mainTool === "Interaction" && <InteractionTool />}
                {mainTool === "Dialog" && <DialogTool />}
              </div>
            </>
          ) : (
            <SelectInfo />
          )}
        </>
      )}
    </SideToolBarContainer>
  );
};

const SideToolBarContainer = styled.div`
  .edit-mode-button {
    margin-bottom: 10px;
  }
  .tool-container {
    margin-top: 10px;
  }
`;
