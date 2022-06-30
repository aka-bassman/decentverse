import styled, { keyframes } from "styled-components";

type GuestButtonProps = {
  onClick: () => void;
};
export const GuestButton = ({ onClick }: GuestButtonProps) => (
  <Button onClick={onClick}>
    <div style={{ marginLeft: 50 }}>Start as a Guest</div>
  </Button>
);

const Button = styled.button`
  width: 500px;
  height: auto;
  padding-left: 30px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: flex-start;
  align-items: center;
  font-size: 30px;
  color: white;
  background: gray;
  display: flex;
  align-self: center;
  justify-self: center;
  border-radius: 10px;
  transition: 0.3s;

  @media screen and (max-width: 800px) {
    width: 260px;
    height: 50px;
    padding-left: 30px;
    padding-right: 7px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-bottom: 10px;
    font-size: 16px;
    align-items: center;
    justify-content: flex-start;
    color: white;
    background: gray;
    display: flex;
    border-radius: 10px;
  }
  :hover {
    opacity: 0.8;
  }
`;
