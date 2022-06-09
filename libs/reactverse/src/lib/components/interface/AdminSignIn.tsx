import { useAdmin } from "../../stores";
import { Button, Form, Input, Card } from "antd";

export const AdminSignIn = () => {
  const signinAdmin = useAdmin((state) => state.signinAdmin);
  const setAdminView = useAdmin((state) => state.setAdminView);

  const onFinish = (values: any) => {
    const { accountId, password } = values;
    signinAdmin(accountId, password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Card title="Sign In" size="small">
        <Form
          name="sign in"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="accountId"
            name="accountId"
            rules={[{ required: true, message: "Please input your accountId!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={() => setAdminView("signUp")}>
          Sign Up &gt;&gt;
        </Button>
      </div> */}
    </>
  );
};
