import { useAdmin, useMapEditor } from "../../stores";
import { Button, Card } from "antd";
import styled from "styled-components";

export const AdminInfo = () => {
  const me = useAdmin((state) => state.me);
  const signout = useAdmin((state) => state.signout);
  const toggleMapEditorOpen = useMapEditor((state) => state.toggleMapEditorOpen);

  return (
    <AdminInfoContainer>
      <Card title={me?.accountId} size="small">
        <div>{me?.email}</div>
        <Button type="primary" block onClick={toggleMapEditorOpen} style={{ marginTop: 20 }}>
          Map Editor
        </Button>
      </Card>
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={signout}>
          log out
        </Button>
      </div>
    </AdminInfoContainer>
  );
};

const AdminInfoContainer = styled.div`
  width: 240px;
`;
