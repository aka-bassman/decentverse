import { useState } from "react";
import styled, { keyframes } from "styled-components";

type CharacterBoxProps = {
  characters: string[];
};

export const CharacterBox = ({ characters }: CharacterBoxProps) => {
  const [selectNumber, select] = useState<number>(0);
  return (
    <>
      <Title>Select Your Character!</Title>
      <ChoiceBox>
        {characters.map((image, idx) => (
          <CharacaterImage key={idx} selected={selectNumber === idx} onClick={() => select(idx)}>
            <img style={{ width: "100%" }} key={idx} src={image} />
          </CharacaterImage>
        ))}
      </ChoiceBox>
    </>
  );
};

const Title = styled.p`
  font-size: 26px;

  margin-bottom: 0px;
`;

const ChoiceBox = styled.div`
  display: flex;
  width: 500px;
  height: 300px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  flex-wrap: wrap;
  background-color: white;
  overflow-y: scroll;
  color: black;
  /* justify-content: center;
  align-items: center; */
  /* -ms-overflow-style: none; */
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 800px) {
    width: 95%;
    /* height: 50%; */
    margin-top: 0px;
    margin-bottom: 10px;
    /* height: auto; */

    /* background: black; */
  }
`;

const CharacaterImage = styled.button<{ selected: boolean }>`
  width: 33.3%;
  /* height: 100; */
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border-radius: 10px;
  /* position: relative;
  display: flex;
  justify-content: center;
  align-items: center; */
  border-width: 5px;
  border-color: ${(props) => (props.selected ? "#348fc4" : "transparent")};
  background: white;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    width: 33%;
    height: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    /* margin-left: 1px;
    margin-right: 1px; */
    background-color: transparent;
    border-radius: 10px;
    position: relative;
    justify-content: center;
    align-items: center;
    border-width: 5px;
    /* background-color: red; */
    border-color: ${(props) => (props.selected ? "#348fc4" : "transparent")};
    /* height: auto; */
  }
`;

const Image = styled.img`
  width: 100%;
  @media screen and (max-width: 800px) {
    width: 100;
    height: 100%;
  }
`;
