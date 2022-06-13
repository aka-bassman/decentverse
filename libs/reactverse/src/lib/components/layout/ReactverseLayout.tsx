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
`;
