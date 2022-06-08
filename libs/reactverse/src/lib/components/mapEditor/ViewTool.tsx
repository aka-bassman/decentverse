import styled from "styled-components";
import { Card, Checkbox } from "antd";
import { useMapEditor } from "../../stores";

export const ViewTool = () => {
  const { isActiveViewMode, toggleViewMode } = useMapEditor();

  return (
    <Card title="View mode" size="small">
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
    </Card>
  );
};
