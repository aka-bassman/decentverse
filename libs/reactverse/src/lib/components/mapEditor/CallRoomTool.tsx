import styled from "styled-components";
import { InputNumber } from "antd";
import { useEditor, useGame } from "../../stores";

export const CallRoomTool = () => {
  const inputCallRoomMaxNum = useEditor((state) => state.inputCallRoomMaxNum);
  const setInputCallRoomMaxNum = useEditor((state) => state.setInputCallRoomMaxNum);
  const lockKey = useGame((state) => state.lockKey);

  return (
    <div>
      <InputNumber
        addonBefore="Max Num"
        style={{ width: "100%" }}
        value={inputCallRoomMaxNum}
        onChange={setInputCallRoomMaxNum}
        onFocus={() => lockKey(true)}
        onBlur={() => lockKey(false)}
      />
    </div>
  );
};
