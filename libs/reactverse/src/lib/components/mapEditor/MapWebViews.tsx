import { Suspense } from "react";
import { useEditor, useGame } from "../../stores";

export const MapWebViews = () => {
  const webviews = useEditor((state) => state.webviews);
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const webviewPreview = useEditor((state) => state.webviewPreview);
  const lockKey = useGame((state) => state.lockKey);

  const selectItem = (placeId: string) => {
    lockKey(false);
    clickOnItem(placeId);
  };

  return (
    <Suspense fallback={null}>
      {webviewPreview.isPreview && (
        <mesh position={[webviewPreview.x, webviewPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[webviewPreview.width, webviewPreview.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" opacity={0.5} transparent={true} />
        </mesh>
      )}

      {webviews.map((webview, index) => (
        <mesh key={index} position={[webview.x, webview.y, 0]} onClick={() => selectItem(webview.placeId)}>
          <planeBufferGeometry attach="geometry" args={[webview.width, webview.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" opacity={0.7} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
