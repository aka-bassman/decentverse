import { Suspense } from "react";
import { useEditor } from "../../stores";

export const MapCollisions = () => {
  const { collisions, clickOnCollision, collisionPreview } = useEditor();

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
        <mesh key={index} position={[collision.x, collision.y, 0]} onClick={(e) => clickOnCollision(e, index)}>
          <planeBufferGeometry attach="geometry" args={[collision.width, collision.height]} />
          <meshPhongMaterial attach="material" color="#FF6666" opacity={0.9} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
