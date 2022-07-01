import styled from "styled-components";
import { Segmented, Menu, Radio, Button } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
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
          <Menu
            className="edit-mode-button"
            mode="horizontal"
            defaultSelectedKeys={["Select"]}
            onSelect={({ key }) => setEditMode(key as TEditMode)}
          >
            <Menu.Item key="Select" icon={<SearchOutlined />}>
              Select
            </Menu.Item>
            <Menu.Item key="Add" icon={<EditOutlined />}>
              Add
            </Menu.Item>
          </Menu>

          {editMode === "Add" ? (
            <>
              <Menu
                className="main-tool"
                mode="horizontal"
                defaultSelectedKeys={["Assets"]}
                onSelect={({ key }) => setMainTool(key as TMainTool)}
              >
                <Menu.Item key="Assets">Assets</Menu.Item>
                <Menu.Item key="Interaction">Interaction</Menu.Item>
                <Menu.Item key="Dialog">Dialog</Menu.Item>
              </Menu>

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
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;

  .edit-mode-button {
    margin-bottom: 10px;
  }
  .tool-container {
    margin-top: 10px;
    flex-grow: 1;
    align-self: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;
