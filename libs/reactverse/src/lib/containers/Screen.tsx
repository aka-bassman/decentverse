import { useWindowDimensions, useKeyboard } from "../hooks";

// export interface ReactverseProps {
//   a: any;
// }

export const Screen = ({ children }: any) => {
  const [width, height] = useWindowDimensions();
  useKeyboard();
  return children;
};
