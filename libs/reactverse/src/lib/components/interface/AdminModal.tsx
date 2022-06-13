import { useEffect, useRef, useState } from "react";
import { useGossip, useAdmin, types } from "../../stores";
import styled from "styled-components";
import { Button } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { AdminSignIn, AdminSignUp, AdminInfo } from "./index";

export const AdminModal = () => {
  const { init, adminView, toggleShowAdminModal, isShowAdminModal } = useAdmin();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <AdminButton onClick={toggleShowAdminModal} type="primary" shape="circle" icon={<ToolOutlined />} />
      {isShowAdminModal && (
        <AdminModalContainer>
          {adminView === "signIn" && <AdminSignIn />}
          {adminView === "signUp" && <AdminSignUp />}
          {adminView === "info" && <AdminInfo />}
        </AdminModalContainer>
      )}
    </>
  );
};

const AdminButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
`;

const AdminModalContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.4);
`;
