import React, { Suspense } from "react";
import { useEditor, types } from "../../stores";
import { TextureLoader } from "three";

export const MapAssetPreview = React.memo(() => {
  const preview = useEditor((state) => state.preview);
  const loader = new TextureLoader();
  const previewTexture = preview.image && loader.load(preview.image);

  if (!previewTexture) return null;
  return (
    <Suspense fallback={null}>
      {preview.isPreview && (
        <sprite position={[preview.x, preview.y, 3]}>
          <planeGeometry args={[preview.width, preview.height]} />
          <spriteMaterial map={previewTexture} transparent={true} opacity={0.5} />
        </sprite>
      )}
    </Suspense>
  );
});
