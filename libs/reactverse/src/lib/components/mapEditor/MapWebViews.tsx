import { Suspense } from "react";
import { useEditor } from "../../stores";

export const MapWebViews = () => {
  const webviews = useEditor((state) => state.webviews);
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const webviewPreview = useEditor((state) => state.webviewPreview);

  return (
    <Suspense fallback={null}>
      <ambientLight />
      {webviewPreview.isPreview && (
        <mesh position={[webviewPreview.x, webviewPreview.y, 0]}>
          <planeBufferGeometry attach="geometry" args={[webviewPreview.width, webviewPreview.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" opacity={0.5} transparent={true} />
        </mesh>
      )}

      {webviews.map((webview, index) => (
        <mesh key={index} position={[webview.x, webview.y, 0]} onClick={(e) => clickOnItem(e, webview.placeId)}>
          <planeBufferGeometry attach="geometry" args={[webview.width, webview.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" opacity={0.9} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
