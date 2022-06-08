import styled from "styled-components";
import { Segmented, Card } from "antd";
import { useMapEditor } from "../../stores";

export const InteractionTool = () => {
  const { subTool, setSubTool } = useMapEditor();

  return (
    <Card title="Interaction" size="small">
      <Segmented block options={["Add", "Remove"]} value={subTool} onChange={(value) => setSubTool(value as string)} />
    </Card>
  );
};
