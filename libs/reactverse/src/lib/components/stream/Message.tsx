import { types } from "../../stores";
export const Message = ({ fromName, from, text, at }: types.Message) => {
  return (
    <div>
      {fromName}: {text}
    </div>
  );
};
