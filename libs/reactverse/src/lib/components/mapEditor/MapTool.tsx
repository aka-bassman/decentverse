import styled from "styled-components";
import { Card, List } from "antd";

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

export const MapTool = () => {
  return (
    <Card title="Map" size="small">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              console.log("");
            }}
            style={{ cursor: "pointer" }}
          >
            <List.Item.Meta
              // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={item.title}
              // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
