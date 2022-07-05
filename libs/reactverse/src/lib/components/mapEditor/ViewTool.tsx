import styled from "styled-components";
import { Card, Checkbox } from "antd";
import { useEditor } from "../../stores";

export const ViewTool = () => {
  const { isActiveViewMode, toggleViewMode } = useEditor();

  return (
    <ViewToolContainer>
      <div>
        <Checkbox onChange={() => toggleViewMode("Interaction")} checked={isActiveViewMode("Interaction")}>
          Interaction
        </Checkbox>
      </div>
      <div className="sub-list">
        <div>
          <Checkbox onChange={() => toggleViewMode("Collision")} checked={isActiveViewMode("Collision")}>
            Collision
          </Checkbox>
        </div>
        <div>
          <Checkbox onChange={() => toggleViewMode("WebPage")} checked={isActiveViewMode("WebPage")}>
            WebPage
          </Checkbox>
        </div>
        <div>
          <Checkbox onChange={() => toggleViewMode("CallRoom")} checked={isActiveViewMode("CallRoom")}>
            CallRoom
          </Checkbox>
        </div>
      </div>
      <div>
        <Checkbox onChange={() => toggleViewMode("Assets")} checked={isActiveViewMode("Assets")}>
          Assets
        </Checkbox>
        <div className="sub-list">
          <div>
            <Checkbox onChange={() => toggleViewMode("AssetTop")} checked={isActiveViewMode("AssetTop")}>
              top
            </Checkbox>
          </div>
          <div>
            <Checkbox onChange={() => toggleViewMode("AssetBottom")} checked={isActiveViewMode("AssetBottom")}>
              bottom
            </Checkbox>
          </div>
        </div>
      </div>
    </ViewToolContainer>
  );
};

const ViewToolContainer = styled.div`
  .sub-list {
    margin-left: 20px;
    margin-bottom: 6px;
  }
`;
