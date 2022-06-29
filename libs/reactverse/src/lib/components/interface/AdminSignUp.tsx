import { useAdmin } from "../../stores";
import { Button, Form, Input, Card } from "antd";

export const AdminSignUp = () => {
  const createAdmin = useAdmin((state) => state.createAdmin);
  const setAdminView = useAdmin((state) => state.setAdminView);

  const onFinish = (values: any) => {
    createAdmin(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log();
  };

  return (
    <>
      <Card title="Sign Up" size="small">
        <Form
          name="basic"
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
          <Form.Item label="email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
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
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={() => setAdminView("signIn")}>
          Sign In &gt;&gt;
        </Button>
      </div>
    </>
  );
};
