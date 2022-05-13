import { useEffect } from "react";
import { useWindowDimensions, useKeyboard } from "../hooks";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

// export interface ReactverseProps {
//   a: any;
// }

export const Screen = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const [width, height] = useWindowDimensions();
  useKeyboard();
  useEffect(() => {
    (async () => {
      console.log(await dispatch(actions.initWorld()));
    })();
  }, []);
  return children;
};
