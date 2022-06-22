import { types, useEditor } from "../../stores";
import { SelectAssetInfo, SelectCollisionInfo, SelectwebviewInfo, SelectCallRoomInfo } from "./index";
import styled from "styled-components";

export const SelectInfo = () => {
  const viewItems = useEditor((state) => state.viewItems);

  return (
    <SelectInfoContainer>
      {viewItems.map((viewItem) => (
        <div key={viewItem.data.placeId}>
          {viewItem.type === "asset" && <SelectAssetInfo data={viewItem.data as types.TAsset} />}
          {viewItem.type === "collision" && <SelectCollisionInfo data={viewItem.data as types.TCollision} />}
          {viewItem.type === "webview" && <SelectwebviewInfo data={viewItem.data as types.TWebview} />}
          {viewItem.type === "callRoom" && <SelectCallRoomInfo data={viewItem.data as types.TCallRoom} />}
        </div>
      ))}
    </SelectInfoContainer>
  );
};

const SelectInfoContainer = styled.div`
  overflow: scroll;
`;
