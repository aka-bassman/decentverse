import styled from "styled-components";
import { InputNumber } from "antd";
import { useEditor } from "../../stores";

export const CallRoomTool = () => {
  const { inputCallRoomMaxNum, setInputCallRoomMaxNum, selectedUrl, setUrlInput, addUrl, selectUrl } = useEditor();

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
