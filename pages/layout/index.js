import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Tooltip,
  Form,
  Affix,
} from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

import { FcBullish } from "react-icons/fc";
import Cookies from "js-cookie";
import { PageHeader } from "@ant-design/pro-layout";

const Sider = ({ selectedIndex, selectedKey }) => {
  let [items, setItems] = useState([
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <FcBullish />,
    },
  ]);

  return (
    <Affix>
      <Layout.Sider collapsible theme="light">
        <Menu
          onClick={selectedIndex}
          selectedKeys={selectedKey}
          items={items}
          defaultSelectedKeys="dashboard"
          style={{
            height: "100vh",
            fontSize: 17,
          }}
        />
      </Layout.Sider>
    </Affix>
  );
};

const Header = () => {
  const [currentUser, setCurrentUser] = useState({ name: "", lastname: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [form] = Form.useForm();
  const [location, setLocation] = useState();

  return (
    <>
      <Layout.Header
        style={{
          backgroundColor: "#aaa",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingInline: 20,
        }}
      >
        <Space>
          <Tooltip title="Profile Settings">
            <Button
              size="large"
              icon={<SettingOutlined />}
              style={{
                backgroundColor: "#aaa",
                color: "#fff",
                padding: 0,
              }}
              onClick={() => {
                setOpenEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Logout">
            <Button
              size="large"
              icon={<LogoutOutlined />}
              style={{
                backgroundColor: "#aaa",
                color: "#fff",
                padding: 0,
              }}
              onClick={() => {
                Cookies.remove("currentUser");
                Cookies.remove("loggedIn");
                Cookies.remove("mode");
                window.location.reload();
              }}
            />
          </Tooltip>
        </Space>
      </Layout.Header>
    </>
  );
};

const Content = ({ selectedKey, setSelectedKey }) => {
  return (
    <div
      style={{
        backgroundColor: "#eee",
        height: "100%",
        padding: "10px",
        overflow: "scroll",
      }}
    >
      <PageHeader title={selectedKey.toString().toUpperCase()}>
        {Cookies.get("mode")}
      </PageHeader>
    </div>
  );
};

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#aaa",
      }}
    >
      <Typography.Title level={5} style={{ marginTop: 10 }}></Typography.Title>
    </Layout.Footer>
  );
};

const _Layout = () => <></>;

export { Sider, Header, Content, Footer };
export default _Layout;
