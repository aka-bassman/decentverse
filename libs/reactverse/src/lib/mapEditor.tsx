import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { client, useMapEditor } from "./stores";
import { ApolloProvider } from "@apollo/client";
import { Map, SideToolBar } from "./components";
import { Layout } from "antd";
import styled from "styled-components";
const { Sider, Content } = Layout;

export const MapEditor = () => {
  const { init } = useMapEditor();

  useEffect(() => {
    init();
  }, []);

  return (
    <ApolloProvider client={client}>
      <MapEditorLayout>
        <StyledSider>
          <SideToolBar />
        </StyledSider>
        <Layout>
          <Content>
            <Map />
          </Content>
        </Layout>
      </MapEditorLayout>
    </ApolloProvider>
  );
};

const MapEditorLayout = styled(Layout)`
  height: 100vh;
`;

const StyledSider = styled(Sider)`
  background-color: #ddd;
  padding: 10px;
  min-width: 300px !important;
  max-width: 300px !important;
  width: 300px !important;
`;
