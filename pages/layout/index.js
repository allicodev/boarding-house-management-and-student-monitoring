import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Affix,
  Avatar,
  Dropdown,
  Tag,
  Button,
  Tooltip,
} from "antd";
import { UserOutlined, LogoutOutlined, CheckOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";
import { PageHeader } from "@ant-design/pro-layout";
import EditProfile from "./components/edit_profile";

import json from "../assets/json/constant.json";

const user = Cookies.get("currentUser");

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

const Header = ({ app_key }) => {
  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    data: null,
  });
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(
      json.colleges.filter(
        (e) => e.value == JSON.parse(user ?? "{}").college
      )[0]?.color
    );
  }, []);

  return (
    <>
      <Affix>
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
          <div>
            <Tag color="#87d068">
              {Cookies.get("mode")?.toLocaleUpperCase()}
            </Tag>
            {![null, undefined, ""].includes(
              JSON.parse(user ?? "{}")?.college
            ) && (
              <Tooltip
                title={
                  json.colleges.filter(
                    (e) => e.value == JSON.parse(user ?? "{}").college
                  )[0]?.label
                }
              >
                <Tag color={color}>
                  {JSON.parse(user ?? "{}").college?.toUpperCase()}
                </Tag>
              </Tooltip>
            )}
          </div>

          {user != null && (
            <div style={{ display: "flex", alignSelf: "center" }}>
              <Dropdown
                menu={{
                  items: [
                    {
                      label: "Edit Profile",
                      key: "edit",
                      onClick: () =>
                        setOpenEditModal({
                          open: true,
                          data: JSON.parse(user),
                        }),
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
          )}

          {user == null && (
            <Button
              onClick={() => {
                Cookies.remove("loggedIn");
                Cookies.remove("mode");
                Cookies.remove("guestSubmit");
                window.location.reload();
              }}
              danger
            >
              LOGOUT
            </Button>
          )}
        </Layout.Header>
      </Affix>

      {/* UTILS */}
      <EditProfile
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        app_key={app_key}
      />
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
