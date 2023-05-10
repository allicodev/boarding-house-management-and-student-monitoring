import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Form, Input, Button, Alert, Row, Col, Menu } from "antd";

const Login = () => {
  const [mode, setMode] = useState("student");
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
        onFinish={() => {}}
      >
        {/* {isError.show && (
            <Alert
              description={isError.description}
              onClose={() => setIsError({ show: false, description: "" })}
              type="error"
              closable
            />
          )} */}
        <Menu
          items={[
            {
              label: "Student",
              key: "student",
              style: {
                width: "33%",
                textAlign: "center",
              },
            },
            {
              label: "Landlord",
              key: "landlord",
              style: {
                width: "33%",
                textAlign: "center",
              },
            },
            {
              label: "Admin",
              key: "admin",
              style: {
                width: "33%",
                textAlign: "center",
              },
            },
          ]}
          style={{ backgroundColor: "#eee" }}
          onClick={(e) => setMode(e.key)}
          selectedKeys={[mode]}
          mode="horizontal"
        />
        <Form.Item label="Email" name="email">
          <Input size="large" onChange={(e) => {}} />
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
            onClick={() => {
              // Cookies.set("currentUser", JSON.stringify(data.currentUser));
              Cookies.set("loggedIn", "true");
              Cookies.set("mode", mode);
              // message.success(data.message);
              location?.reload();
            }}
          >
            Login as <strong> {mode.toLocaleUpperCase()}</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
