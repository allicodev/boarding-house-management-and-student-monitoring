import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Form,
  Input,
  Button,
  Alert,
  Modal,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import axios from "axios";

const Login = () => {
  const [isError, setIsError] = useState({ show: false, description: "" });
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [credits, openCredits] = useState(false);
  const [location, setLocation] = useState();

  const [form] = Form.useForm();

  const handleLogin = async (val) => {
    let { data } = await axios.post("/api/auth", {
      payload: {
        mode: "login",
        email: val.email,
        password: val.password,
      },
    });
    if (data.status == 404)
      setIsError({ show: true, description: "Account doesn't exist" });
    else if (data.status == 403)
      setIsError({ show: true, description: "Wrong password" });
    else if (data.status == 200) {
      Cookies.set("currentUser", JSON.stringify(data.currentUser));
      Cookies.set("loggedIn", "true");
      message.success(data.message);
      location?.reload();
    }
  };

  const handleNewUser = async () => {
    if (email != "") {
      let { data } = await axios.get("/api/auth", { params: { email } });
      if (data.status == 200) setOpenModal(true);
      else {
        if (data.status == 404) message.error(data.message);
        else message.warning(data.message);
      }
    }
  };

  useEffect(() => {
    setLocation(window.location);
  }, []);

  return (
    <Row gutter={[32, 0]}>
      <Col span={10} className="main-body-login">
        <Modal
          open={openModal}
          title={`Setup account for email '${email}'`}
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button key="key 1" type="primary" onClick={form.submit}>
              Update
            </Button>,
          ]}
        >
          <Form
            form={form}
            onFinish={async (val) => {
              const { confirm, password } = val;
              if (confirm != password) {
                message.error("password and confirm password didn't match.");
                return;
              }

              let { data } = await axios.post("/api/auth", {
                payload: {
                  ...val,
                  email,
                  mode: "new-user",
                },
              });

              if (data.status == 200) {
                Cookies.set("currentUser", JSON.stringify(data.currentUser));
                Cookies.set("loggedIn", "true");
                message.success(data.message);
                location?.reload();
              }
            }}
            labelCol={{ span: 7 }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Lastname"
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          labelAlign="right"
          style={{
            width: 400,
            padding: 30,
            background: "#fff",
          }}
          onFinish={handleLogin}
        >
          {isError.show && (
            <Alert
              description={isError.description}
              onClose={() => setIsError({ show: false, description: "" })}
              type="error"
              closable
            />
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              size="large"
              addonAfter={
                <Button
                  type="link"
                  style={{ padding: 0.1 }}
                  onClick={handleNewUser}
                >
                  new user
                </Button>
              }
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item noStyle>
            <Button
              type="primary"
              style={{ width: "100%" }}
              htmlType="submit"
              size="large"
              onClick={() => setIsError({ show: false, description: "" })}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={14} className="main-login-info">
        <Typography.Title
          style={{ marginTop: "45vh", color: "#fff", fontFamily: "sans-serif" }}
        >
          E-Sitizen
        </Typography.Title>
        <Typography.Title
          level={5}
          style={{
            fontStyle: "italic",
            textAlign: "center",
            color: "#fff",
          }}
        >
          A Web-Based Information and Health Monitoring System For The Senior
          Citizen of the Municipality of Kadingilan Bukidnon
        </Typography.Title>
      </Col>
      {/* CREDITS */}
      <Modal
        open={credits}
        onCancel={() => openCredits(false)}
        footer={null}
        closable={false}
      >
        Wala ko kabalo say ibutang haha
      </Modal>
    </Row>
  );
};

export default Login;
