import styled from "styled-components";
import { InputNumber } from "antd";
import { useEditor } from "../../stores";

export const CallRoomTool = () => {
  const inputCallRoomMaxNum = useEditor((state) => state.inputCallRoomMaxNum);
  const setInputCallRoomMaxNum = useEditor((state) => state.setInputCallRoomMaxNum);

  return (
    <div>
      <InputNumber
        addonBefore="Max Num"
        style={{ width: "100%" }}
        value={inputCallRoomMaxNum}
        onChange={setInputCallRoomMaxNum}
      />
    </div>
  );
};
