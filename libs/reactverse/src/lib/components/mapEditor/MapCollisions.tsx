import { Suspense } from "react";
import { useEditor } from "../../stores";

export const MapCollisions = () => {
  const collisions = useEditor((state) => state.collisions);
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const collisionPreview = useEditor((state) => state.collisionPreview);

  return (
    <Suspense fallback={null}>
      <ambientLight />
      {collisionPreview.isPreview && (
        <mesh position={[collisionPreview.x, collisionPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[collisionPreview.width, collisionPreview.height]} />
          <meshPhongMaterial attach="material" color="#FF6666" opacity={0.5} transparent={true} />
        </mesh>
      )}

      {collisions.map((collision, index) => (
        <mesh key={index} position={[collision.x, collision.y, 0]} onClick={(e) => clickOnItem(e, collision.placeId)}>
          <planeBufferGeometry attach="geometry" args={[collision.width, collision.height]} />
          <meshPhongMaterial attach="material" color="#FF6666" opacity={0.9} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
