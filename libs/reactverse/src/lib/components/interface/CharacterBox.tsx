import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useWorld, useUser, types } from "../../stores";
type CharacterBoxProps = {
  characters: types.Character[];
};

export const CharacterBox = ({ characters }: CharacterBoxProps) => {
  const [selectNumber, select] = useState<number>(0);
  const selectCharacter = useWorld((state) => state.selectCharacter);
  selectCharacter(characters[selectNumber]);
  return (
    <>
      <Title>Select Your Character!</Title>
      <ChoiceBox>
        {characters.map((image, idx) => (
          <CharacaterImage key={idx} selected={selectNumber === idx} onClick={() => select(idx)}>
            <div className="ImageWrapper">
              <Image src={image.file.url} />
            </div>
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
  min-height: 300px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  flex-wrap: wrap;
  background-color: white;
  overflow-y: scroll;
  color: black;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 800px) {
    width: 95%;
    /* height: 900; */
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
  overflow: hidden;

  .ImageWrapper {
    width: 600px;
    height: 240px;
    overflow: hidden;
  }
  @media screen and (max-width: 800px) {
    width: 33%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: transparent;
    border-radius: 10px;
    position: relative;
    justify-content: center;
    align-items: center;
    border-width: 5px;
    border-color: ${(props) => (props.selected ? "#348fc4" : "transparent")};
  }
`;

const Image = styled.img`
  width: 100%;
  @media screen and (max-width: 800px) {
    width: auto;
    height: 80%;
  }
  -webkit-user-drag: none;
`;
