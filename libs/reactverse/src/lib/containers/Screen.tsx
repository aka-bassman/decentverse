import { useEffect } from "react";
import { useWindowDimensions, useKeyboard } from "../hooks";
import { useGame, useWorld } from "../stores";

// export interface ReactverseProps {
//   a: any;
// }

export const Screen = ({ children }: any) => {
  const initWorld = useWorld((state) => state.initWorld);
  useWindowDimensions();
  useEffect(() => {
    (async () => {
      await initWorld();
    })();
  }, []);
  return children;
};
