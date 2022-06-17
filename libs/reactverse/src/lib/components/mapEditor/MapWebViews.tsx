import { Suspense } from "react";
import { useEditor } from "../../stores";

export const MapWebViews = () => {
  const { webviews, clickOnWebview, webviewPreview } = useEditor();

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
        <mesh key={index} position={[webview.x, webview.y, 0]} onClick={(e) => clickOnWebview(e, index)}>
          <planeBufferGeometry attach="geometry" args={[webview.width, webview.height]} />
          <meshPhongMaterial attach="material" color="#6666FF" opacity={0.9} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
