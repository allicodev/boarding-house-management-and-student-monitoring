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
  Image,
  message,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";
import { PageHeader } from "@ant-design/pro-layout";
import EditProfile from "./components/edit_profile";

import json from "../assets/json/constant.json";
import ReportGenerator from "./components/report_generator";
import axios from "axios";

const user = Cookies.get("currentUser");

const Sider = ({ selectedIndex, selectedKey, items, image }) => {
  return (
    <Affix>
      <Layout.Sider collapsible theme="light">
        <div
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Image
            preview={false}
            src={image == null ? "/logo.png" : image}
            alt="logo"
            width={150}
          />
        </div>
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
  const [report, setReport] = useState({
    open: false,
    columns: [],
    title: "",
    data: null,
  });

  const openReport = (type) => {
    const isEstab = type == "establishment";

    const estabColumn = [
      { title: "name", align: "center", dataIndex: "name" },
      {
        title: "Status",
        align: "center",
        render: (_, row) =>
          row?.verification.at(-1).status == "approved" ?? false
            ? "Verified"
            : "Not Verified",
      },
      {
        title: "Owner",
        align: "center",
        render: (_, row) => row.ownerId.firstName + " " + row.ownerId.lastName,
      },
      {
        title: "Address",
        align: "center",
        render: (_, row) => row.address,
      },
      {
        title: "Space to Rent",
        align: "center",
        render: (_, row) => row.totalSpaceForRent,
      },
      {
        title: "Space Occupied",
        align: "center",
        render: (_, row) => row.totalOccupied,
      },
    ];

    const studColumn = [
      { title: "ID Number", align: "center", dataIndex: "idNumber" },
      {
        title: "Name",
        align: "center",
        render: (_, row) => row.firstName + " " + row.lastName,
      },
      { title: "Email", align: "center", dataIndex: "email" },
      { title: "Gender", align: "center", dataIndex: "gender" },
      { title: "Year", align: "center", dataIndex: "year" },
      {
        title: "College",
        align: "center",
        render: (_, row) =>
          json.colleges.filter((e) => e.value == row.college)[0]?.label ?? "",
      },
      {
        title: "Boarding House",
        align: "center",
        render: (_, row) =>
          row?.tenant == null ? (
            <Typography.Text type="secondary">Not yet</Typography.Text>
          ) : (
            row.tenant.establishmentId.name
          ),
      },
    ];
    message.info("Generating reports..");
    (async (_) => {
      if (isEstab) {
        let { data } = await _.get("/api/admin/get-establishments");
        if (data.status == 200) {
          message.success("Report successfully generated");
          setReport({
            open: true,
            columns: estabColumn,
            title: "Masterlist of all Boarding House",
            data: data.data,
          });
        }
      } else {
        let { data } = await _.get("/api/admin/get-students");
        if (data.status == 200) {
          message.success("Report successfully generated");
          setReport({
            open: true,
            columns: studColumn,
            title: "Masterlist of all Students",
            data: data.students,
          });
        }
      }
    })(axios);
  };

  useEffect(() => {
    setColor(
      json.colleges.filter(
        (e) => e.value == JSON.parse(user ?? "{}")?.college
      )[0]?.color
    );
  }, []);

  return (
    <>
      <ReportGenerator
        {...report}
        close={() =>
          setReport({
            open: false,
            columns: [],
            data: null,
          })
        }
      />
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
                    JSON.parse(user ?? "{}").role == "student"
                      ? null
                      : {
                          label: "Report",
                          key: "edit",
                          children: [
                            JSON.parse(user ?? "{}").role == "admin"
                              ? {
                                  label: "Establishment Information",
                                  onClick: () => openReport("establishment"),
                                }
                              : null,
                            {
                              label: "Students Information",
                              onClick: () => openReport("students"),
                            },
                          ],
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
                {JSON.parse(user)?.profilePhoto != null ? (
                  <Image
                    src={JSON.parse(user)?.profilePhoto}
                    width={40}
                    style={{ borderRadius: "100%", backgroundColor: "#fff" }}
                    preview={false}
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    size={40}
                    style={{ cursor: "pointer" }}
                  />
                )}
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
