import styled from "styled-components";
import { Card, Checkbox } from "antd";
import { useEditor } from "../../stores";

export const ViewTool = () => {
  const { isActiveViewMode, toggleViewMode } = useEditor();

  return (
    <div>
      <div>
        <Checkbox onChange={() => toggleViewMode("Interaction")} checked={isActiveViewMode("Interaction")}>
          Interaction
        </Checkbox>
      </div>
      <div>
        <Checkbox onChange={() => toggleViewMode("Assets")} checked={isActiveViewMode("Assets")}>
          Assets
        </Checkbox>
      </div>
    </div>
  );
};
