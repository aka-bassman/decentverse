import { Suspense } from "react";
import { useEditor } from "../../stores";

export const MapCallRooms = () => {
  const { callRooms, clickOnCallRoom, callRoomPreview } = useEditor();

  return (
    <Suspense fallback={null}>
      <ambientLight />
      {callRoomPreview.isPreview && (
        <mesh position={[callRoomPreview.x, callRoomPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[callRoomPreview.width, callRoomPreview.height]} />
          <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.5} transparent={true} />
        </mesh>
      )}

      {callRooms.map((callRoom, index) => (
        <mesh key={index} position={[callRoom.x, callRoom.y, 0]} onClick={(e) => clickOnCallRoom(e, index)}>
          <planeBufferGeometry attach="geometry" args={[callRoom.width, callRoom.height]} />
          <meshPhongMaterial attach="material" color="#36B3A0" opacity={0.9} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
