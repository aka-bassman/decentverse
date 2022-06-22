import { Button } from "antd";
import { useEditor, types } from "../../stores";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const SelectInfoButtons = ({ remove, placeId }: { remove: (placeId: string) => void; placeId: string }) => {
  return (
    <ButtonsArea>
      <Button icon={<DeleteOutlined />} onClick={() => remove(placeId)} size="small">
        delete
      </Button>
    </ButtonsArea>
  );
};

const ButtonsArea = styled.div`
  text-align: right;
  svg {
    vertical-align: baseline;
  }
`;
