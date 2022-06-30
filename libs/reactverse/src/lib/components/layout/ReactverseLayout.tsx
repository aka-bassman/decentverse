import styled from "styled-components";
import { client } from "../../stores";
import { ApolloProvider } from "@apollo/client";
import { useGame } from "../../stores";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import "antd/dist/antd.css";
import { isMobile, isIOS } from "react-device-detect";

interface Props {
  children?: JSX.Element[] | JSX.Element;
}

export const ReactverseLayout = ({ children }: Props) => {
  return (
    <ApolloProvider client={client}>
      <AppContainer>{children}</AppContainer>
    </ApolloProvider>
  );
};

const AppContainer = styled.div`
  width: 100%;
  /* height: ${document.documentElement.clientHeight}px; */
  height: 100vh;

  @media screen and (max-width: 800px) {
    width: 100%;
    /* height: ${document.documentElement.clientHeight}px; */
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    overscroll-behavior: none;
  }
`;
