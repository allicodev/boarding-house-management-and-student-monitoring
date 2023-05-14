import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Affix,
  Avatar,
  Dropdown,
  Tag,
  Badge,
} from "antd";
import { UserOutlined, LogoutOutlined, BellOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";
import { PageHeader } from "@ant-design/pro-layout";

const Sider = ({ selectedIndex, selectedKey, items }) => {
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
  return (
    <>
      <Layout.Header
        style={{
          backgroundColor: "#aaa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
          width: "100%",
          paddingInline: 10,
        }}
      >
        <Tag color="#87d068">{Cookies.get("mode")?.toLocaleUpperCase()}</Tag>
        <div style={{ display: "flex", alignSelf: "center" }}>
          <Dropdown
            menu={{
              items: [
                {
                  label: "OPTION 1",
                  key: "option1",
                },
                {
                  label: "OPTION 1",
                  key: "option2",
                },
                {
                  type: "divider",
                },
                {
                  label: (
                    <div style={{ color: "#ff0000" }}>
                      logout <LogoutOutlined />
                    </div>
                  ),
                  key: "3",
                  onClick: () => {
                    Cookies.remove("currentUser");
                    Cookies.remove("loggedIn");
                    Cookies.remove("mode");
                    window.location.reload();
                  },
                },
              ],
            }}
            trigger={["click"]}
          >
            <Avatar
              icon={<UserOutlined />}
              size={40}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      </Layout.Header>
    </>
  );
};

const Content = ({ selectedKey, children }) => {
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
        {children}
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
