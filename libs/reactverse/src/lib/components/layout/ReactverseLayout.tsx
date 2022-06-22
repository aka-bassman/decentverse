import styled from "styled-components";
import { client } from "../../stores";
import { ApolloProvider } from "@apollo/client";
import "antd/dist/antd.css";

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
  height: 100vh;
  @media screen and (max-width: 500px) {
    width: 150%;
    height: 150vh;
    /* border-width: 10px;
    border-color: blue; */
    overflow: "hidden";
    overflow-y: "hidden";
    overflow-x: "hidden";
    /* background-color: red; */
    /* flex-direction: column; */
  }
`;
