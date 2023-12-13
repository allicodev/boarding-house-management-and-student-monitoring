import React, { useEffect, useRef, useState } from "react";
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
  AutoComplete,
  Input,
  Table,
  Modal,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";
import axios from "axios";
import { PageHeader } from "@ant-design/pro-layout";

import json from "../assets/json/constant.json";
import EditProfile from "./components/edit_profile";
import ReportGenerator from "./components/report_generator";
import LandlordSearchFilter from "./components/landlord_search_filter";

const user = Cookies.get("currentUser");

const Sider = ({ selectedIndex, selectedKey, items, image }) => {
  return (
    <Affix
      style={{
        zIndex: 1,
      }}
    >
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
  const [color, setColor] = useState("");
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  //* controls
  const [openLandlordFilter, setOpenLandlordFilter] = useState({
    open: false,
    id: "",
  });
  const [tableConfig, setTableConfig] = useState({
    open: false,
    column: [],
    dataSource: [],
  });

  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    data: null,
  });
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
        render: (_, row) => row.firstName + " " + row.lastName,
      },
      { title: "Email", align: "center", dataIndex: "email" },
      { title: "Gender", align: "center", dataIndex: "gender" },
      { title: "Year", align: "center", dataIndex: "year", width: 30 },
      {
        title: "College",
        render: (_, row) =>
          json.colleges.filter((e) => e.value == row.college)[0]?.label ?? "",
      },
      {
        title: "Course",
        render: (_, row) =>
          row?.course ?? (
            <Typography.Text type="secondary" italic>
              No Data
            </Typography.Text>
          ),
      },
      {
        title: "Boarding House",
        align: "center",
        render: (_, row) =>
          row?.tenant == null ? (
            <Typography.Text type="secondary" italic>
              No Data
            </Typography.Text>
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

  const itemOption = (title, children, onClick) => {
    const label = (
      <span>
        {title}
        <a
          style={{
            float: "right",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          total: {children.length}
        </a>
      </span>
    );

    const option = (e) => {
      return {
        title: e,
        label: <div onClick={() => onClick(e.id)}>{e.name}</div>,
      };
    };
    return {
      label,
      options: children.map((e) => option(e)),
    };
  };

  const runTimer = (searchKeyword) => {
    setSearching(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(function () {
      searchName(searchKeyword, role);
    }, 500);
  };

  const searchName = (search, role) => {
    (async (_) => {
      let { data } = await _.get("/api/admin/search", {
        params: {
          search,
          role,
          id: role == "landlord" ? id : null,
        },
      });

      if (data.status == 200) {
        let _ = [];
        if (data.data.user?.length != 0) {
          if (role == "student")
            _.push(
              itemOption(
                "LANDLORD",
                data.data.user.map((e) => {
                  return {
                    id: e._id,
                    name: e.firstName + " " + e.lastName,
                  };
                }),
                (i) => setOpenLandlordFilter({ open: true, id: i })
              )
            );
          else {
            let student = data.data.user?.filter((e) => e.role == "student");
            let landlord = data.data.user?.filter((e) => e.role == "landlord");
            if (student?.length != 0)
              _.push(
                itemOption(
                  role == "landlord" ? "TENANTS" : "STUDENTS",
                  student.map((e) => {
                    return {
                      id: e._id,
                      name: e.firstName + " " + e.lastName,
                    };
                  })
                )
              );

            if (landlord?.length != 0)
              _.push(
                itemOption(
                  "LANDLORD",
                  landlord.map((e) => {
                    return {
                      id: e._id,
                      name: e.firstName + " " + e.lastName,
                    };
                  }),
                  (i) => setOpenLandlordFilter({ open: true, id: i })
                )
              );
          }
        }

        if (data.data.estab && data.data.estab?.length != 0) {
          _.push(
            itemOption(
              "ESTABLISHMENT",
              data.data.estab.map((e) => {
                return {
                  id: e._id,
                  name: e.name,
                };
              })
            )
          );
        }

        setSearchResult(_);
      }
      setSearching(false);
    })(axios);
  };

  useEffect(() => {
    setColor(
      json.colleges.filter(
        (e) => e.value == JSON.parse(user ?? "{}")?.college
      )[0]?.color
    );
    if (user) {
      let _ = JSON.parse(user);
      setRole(_.role);
      setId(_._id);
    }
  }, [user]);

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
      <LandlordSearchFilter
        open={openLandlordFilter.open}
        close={() => setOpenLandlordFilter({ open: false, id: -1 })}
        openAs={(_) => {
          let id = openLandlordFilter.id;
          setOpenLandlordFilter({ open: false, id: -1 });
          switch (_) {
            case "all-tenant": {
              (async (_) => {
                const { data } = _.get("/api/tenant/get-tenants", {
                  params: {
                    id,
                  },
                });
              })(axios);
              // setOpenEditModal({ open: true });
              break;
            }
          }
        }}
      />
      {/* TABLE for multipurpose use */}
      <Modal
        open={tableConfig.open}
        onCancel={() => setTableConfig({ open: false, column: [] })}
        footer={null}
        closable={false}
      >
        <Table columns={tableConfig.column} />
      </Modal>
      <Affix
        style={{
          zIndex: 1,
        }}
      >
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
          <AutoComplete
            popupClassName="certain-category-search-dropdown"
            popupMatchSelectWidth={350}
            style={{
              width: 300,
            }}
            onChange={(e) => {
              if (e != "") runTimer(e);
              else setSearchResult([]);
            }}
            options={searchResult}
            size="large"
          >
            <Input.Search
              size="large"
              placeholder={
                role == "student"
                  ? "Search Establishment/Landlord"
                  : role == "admin"
                  ? "Search ..."
                  : "Search Tenant"
              }
              loading={searching}
              allowClear
            />
          </AutoComplete>
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
                                  label: "All Establishment List",
                                  onClick: () => openReport("establishment"),
                                }
                              : null,
                            {
                              label: "All Student List",
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
