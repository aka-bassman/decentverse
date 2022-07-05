import { Suspense } from "react";
import { useEditor, useGame } from "../../stores";

export const MapCallRooms = () => {
  const callRooms = useEditor((state) => state.callRooms);
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const callRoomPreview = useEditor((state) => state.callRoomPreview);
  const lockKey = useGame((state) => state.lockKey);

  const selectItem = (placeId: string) => {
    lockKey(false);
    clickOnItem(placeId);
  };

  return (
    <Suspense fallback={null}>
      {callRoomPreview.isPreview && (
        <mesh position={[callRoomPreview.x, callRoomPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[callRoomPreview.width, callRoomPreview.height]} />
          <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.5} transparent={true} />
        </mesh>
      )}

      {callRooms.map((callRoom, index) => (
        <mesh key={index} position={[callRoom.x, callRoom.y, 0]} onClick={(e) => selectItem(callRoom.placeId)}>
          <planeBufferGeometry attach="geometry" args={[callRoom.width, callRoom.height]} />
          <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.7} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
