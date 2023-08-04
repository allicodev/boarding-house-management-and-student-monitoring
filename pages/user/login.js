import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Segmented,
  Typography,
  Image,
  Select,
} from "antd";
import { SwapOutlined } from "@ant-design/icons";
import axios from "axios";
import { PickerDropPane } from "filestack-react";

import json from "../assets/json/constant.json";

const Login = ({ app_key }) => {
  const [mode, setMode] = useState("login");
  const [registerMode, setRegisterMode] = useState("Student");
  const [image, setImage] = useState(null);

  const validate = (val) => {
    const { email, password, confirmpassword } = val;
    let emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!emailRegEx.test(email)) {
      message.error("Invalid email");
      return;
    }

    if (password != confirmpassword) {
      message.error("Passwords didn't match");
      return;
    }

    val = {
      ...val,
      role: registerMode.toLocaleLowerCase(),
      profilePhoto: image,
    };

    (async (_) => {
      let { data } = await _.post("/api/auth/new-user", val);
      console.log(data);

      if (data.status == 201) {
        message.error(data.message);
        return;
      } else if (data.status == 200) {
        Cookies.set("loggedIn", "true");
        Cookies.set("mode", data.user.role);
        Cookies.set("currentUser", JSON.stringify(data.user));
        message.success(data.message);
        location?.reload();
      } else if (data.status == 500 && data.message.code == 11000) {
        message.error("Student ID is taken.");
        return;
      } else message.error(data.message);
    })(axios);
  };

  return (
    <>
      <Button
        type="text"
        style={{
          position: "absolute",
        }}
        icon={<SwapOutlined />}
        onClick={() => setMode(mode == "login" ? "register" : "login")}
      >
        Switch to {mode == "login" ? "Registration" : "Login"}
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {mode == "login" && (
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}
            hoverable
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
                (async (_) => {
                  let { data } = await _.post("/api/auth/login", val);

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
                })(axios);
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
                <Button
                  type="text"
                  style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
                  onClick={() => {
                    Cookies.set("loggedIn", "true");
                    Cookies.set("mode", "student");
                    location?.reload();
                  }}
                >
                  Login as guest
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
        {mode == "register" && (
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}
            hoverable
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
            >
              <Form.Item style={{ marginBottom: 0 }} name="registerType">
                <Segmented
                  options={["Student", "Landlord"]}
                  value={registerMode}
                  onChange={(e) => setRegisterMode(e)}
                />
              </Form.Item>
              <Form.Item
                label="First Name:"
                name="firstName"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name:"
                name="lastName"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              {registerMode == "Student" && (
                <Form.Item
                  label="ID Number:"
                  name="idNumber"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                label="Email:"
                name="email"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              {registerMode == "Student" && (
                <Form.Item
                  label="College:"
                  name="college"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true }]}
                >
                  <Select
                    style={{
                      width: 300,
                    }}
                    options={json.colleges}
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Password:"
                name="password"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password:"
                name="confirmpassword"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Phone Number:"
                name="phoneNumber"
                style={{ marginBottom: 0 }}
                rules={[{ required: true }]}
              >
                <Input
                  maxLength={10}
                  prefix={
                    <Typography.Text type="secondary">+63</Typography.Text>
                  }
                />
              </Form.Item>
              <Form.Item
                label="Profile Photo"
                name="profilephoto"
                style={{ marginBottom: 0 }}
              >
                <div
                  style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
                  id="picker-container"
                >
                  {image == null || image == "" ? (
                    <PickerDropPane
                      apikey={app_key}
                      onUploadDone={(res) =>
                        setImage(res?.filesUploaded[0]?.url)
                      }
                      pickerOptions={{ container: "picker-container" }}
                    />
                  ) : null}
                </div>

                {image != null && image != "" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      position: "relative",
                      width: 300,
                      marginBottom: 10,
                    }}
                  >
                    <Image src={image} alt="random_photo" width="100%" />
                    <Button
                      style={{
                        padding: 0,
                        fontSize: 15,
                        position: "absolute",
                        width: 30,
                        borderRadius: "100%",
                        aspectRatio: 1 / 1,
                        right: 5,
                        top: 5,
                      }}
                      danger
                      onClick={() => {
                        setImage(null);
                      }}
                    >
                      X
                    </Button>
                  </div>
                ) : null}
              </Form.Item>
              <Form.Item name="submit" noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  REGISTER
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  return { props: { app_key: process.env.FILESTACK_KEY } };
}

export default Login;
