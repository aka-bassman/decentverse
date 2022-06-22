import styled from "styled-components";

export const SelectInfoBox = ({
  color,
  width,
  height,
  x,
  y,
}: {
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
}) => {
  return (
    <BoxContainer color={color}>
      <div className="box">
        <span className="width">{Math.round(width)}</span>
        <span className="height">{Math.round(height)}</span>
        <div className="dot">
          <span>
            ({Math.round(x)},{Math.round(y)})
          </span>
        </div>
      </div>
    </BoxContainer>
  );
};

const BoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  .box {
    width: 140px;
    height: 80px;
    background-color: ${(props) => props.color};
    position: relative;
    border: 1px solid black;
  }
  .dot {
    width: 3px;
    height: 3px;
    border-radius: 100%;
    background-color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    span {
      font-size: 10px;
    }
  }
  .width {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 10px;
  }
  .height {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(120%, -50%);
    font-size: 10px;
  }
`;
