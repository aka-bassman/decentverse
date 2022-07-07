import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Map, SideToolBar, SubToolBar } from "./components";
import { Layout } from "antd";
import styled from "styled-components";
const { Sider, Content } = Layout;

export const MapEditor = () => {
  return (
    <MapEditorLayout>
      <StyledSider>
        <SideToolBar />
      </StyledSider>
      <Layout>
        <Content>
          <SubToolBar />
          <Map />
        </Content>
      </Layout>
    </MapEditorLayout>
  );
};

const MapEditorLayout = styled(Layout)`
  height: 100vh;
`;

const StyledSider = styled(Sider)`
  background-color: #ddd;
  min-width: 310px !important;
  max-width: 310px !important;
  width: 310px !important;
  height: 100vh;
`;
