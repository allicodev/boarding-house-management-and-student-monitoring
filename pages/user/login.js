import React, { useState } from "react";
import Cookies from "js-cookie";
import { Form, Input, Button, Menu, message } from "antd";
import axios from "axios";

const Login = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
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
          background: "#eee",
          borderRadius: 20,
        }}
        onFinish={(val) => {
          (async () => {
            let { data } = await axios.post("/api/auth/login", val);

            if ([451, 452].includes(data.status)) {
              message.error(data.message);
              return;
            }

            if (data.status == 200) {
              Cookies.set("loggedIn", "true");
              Cookies.set("mode", data.userData.role);
              Cookies.set("currentUser", JSON.stringify(data.userData));
              message.success(data.message);
              location?.reload();
            }
          })();
        }}
      >
        <Form.Item label="Email" name="email">
          <Input size="large" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item noStyle>
          <Button
            type="primary"
            style={{ width: "100%" }}
            htmlType="submit"
            size="large"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
