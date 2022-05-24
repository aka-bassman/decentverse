import { types } from "../../stores";
export const Chat = ({ fromName, from, text, at }: types.Chat) => {
  return (
    <div>
      {fromName}: {text}
    </div>
  );
};
