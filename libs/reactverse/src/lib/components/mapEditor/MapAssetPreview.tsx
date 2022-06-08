import React, { Suspense } from "react";
import { useMapEditor, types } from "../../stores";
import { TextureLoader } from "three";

export const MapAssetPreview = React.memo(() => {
  const preview = useMapEditor((state) => state.preview);
  const loader = new TextureLoader();
  const previewTexture = preview.image && loader.load(preview.image);

  if (!previewTexture) return null;
  return (
    <Suspense fallback={null}>
      {preview.isPreview && (
        <sprite position={[preview.x, preview.y, 3]}>
          <planeGeometry args={[preview.width, preview.height]} />
          <spriteMaterial map={previewTexture} />
        </sprite>
      )}
    </Suspense>
  );
});
