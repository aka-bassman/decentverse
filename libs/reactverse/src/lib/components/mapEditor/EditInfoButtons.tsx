import { Button } from "antd";
import { useEditor, types } from "../../stores";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const EditInfoButtons = ({
  modify,
  close,
  placeId,
}: {
  modify: (placeId: string) => void;
  close: (placeId: string) => void;
  placeId: string;
}) => {
  return (
    <ButtonsArea>
      <Button onClick={() => close(placeId)} size="small" type="text">
        Close
      </Button>

      <Button icon={<DeleteOutlined />} onClick={() => modify(placeId)} size="small">
        Modify
      </Button>
    </ButtonsArea>
  );
};

const ButtonsArea = styled.div`
  text-align: right;
  svg {
    vertical-align: baseline;
  }
  button {
    margin-left: 4px;
  }
`;
