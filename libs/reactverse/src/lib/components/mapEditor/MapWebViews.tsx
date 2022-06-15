import { Suspense } from "react";
import { useMapEditor } from "../../stores";

export const MapWebViews = () => {
  const { collisions, clickOnCollision, collisionPreview } = useMapEditor();

  return (
    <Suspense fallback={null}>
      <ambientLight />
      {collisionPreview.isPreview && (
        <mesh position={[collisionPreview.x, collisionPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[collisionPreview.width, collisionPreview.height]} />
          <meshPhongMaterial attach="material" color="#aaaaff" />
        </mesh>
      )}

      {collisions.map((collision, index) => (
        <mesh key={index} position={[collision.x, collision.y, 0]} onClick={(e) => clickOnCollision(e, index)}>
          <planeBufferGeometry attach="geometry" args={[collision.width, collision.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" />
        </mesh>
      ))}
    </Suspense>
  );
};
