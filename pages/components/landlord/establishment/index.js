import React, { useEffect, useState } from "react";
import {
  Tabs,
  Button,
  message,
  Typography,
  Carousel,
  Image,
  Card,
  Statistic,
  Space,
  Segmented,
  Spin,
  Tag,
  Row,
  Col,
  Popconfirm,
} from "antd";
import NewEstablishment from "./components/new_establishment";
import axios from "axios";
import Cookies from "js-cookie";

import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";

import ModalTable from "./components/modal_table";
import VerificationHistory from "./components/verification_history";
import ReportGenerator from "../../../layout/components/report_generator";
import DeleteForm from "./components/delete_form";
import NoImage from "../../../assets/utilities/no_image";
import json from "../../../assets/json/constant.json";
import ArchiveTable from "../../../assets/utilities/archive_table";

const Establishment = ({ app_key }) => {
  const [openNewEstablishment, setOpenNewEstablishment] = useState(false);
  const [establishment, setEstablishment] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [openTable, setOpenTable] = useState({ open: false, data: null });
  const [loader, setLoader] = useState("");
  const [openedTab, setOpenedTab] = useState("Info");
  const [openVerificationHistory, setOpenVerificationHistory] = useState({
    open: false,
    data: null,
  });
  const [openDeleteEstablishmentForm, setOpenDeleteEstablishmentForm] =
    useState({
      open: false,
      id: null,
    });
  const [report, setReport] = useState({
    open: false,
    data: null,
    title: "",
  });
  const [openStudentProfile, setOpenStudentProfile] = useState({
    open: false,
    data: null,
  });

  const column = [
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
      render: (_, row) => {
        let text = json.colleges
          .filter((e) => e.value == row.college)[0]
          ?.label.split("(")[1];
        return text.substring(0, text.length - 1) ?? "";
      },
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

  const fetchData = async (type, id) => {
    let { data } = await axios.get(`/api/landlord/request-data`, {
      params: { type, id },
    });

    if (data.status != 200) {
      message.error(data.message);
      return;
    } else {
      if (data.data.length > 0) {
        setOpenTable({ open: true, data: data.data });
      } else message.warning("Empty");
    }
  };

  const updatedTabData = (estab) => {
    return estab.map((e, i) => {
      return {
        label: e?.name,
        children: (
          <Row>
            <Col span={20}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Segmented
                  options={["Info", "Images"]}
                  style={{ padding: 5 }}
                  onChange={(e) => setOpenedTab(e)}
                />
              </div>
              {openedTab == "Info" && (
                <>
                  <div style={{ display: "flex", marginTop: 20 }}>
                    <Typography.Title level={2} style={{ marginBottom: 1 }}>
                      {e?.name}
                    </Typography.Title>

                    <Tag
                      color={
                        e?.verification.at(-1).status == "approved"
                          ? "#87d068"
                          : e?.verification.at(-1).status == "pending"
                          ? "#FFD580"
                          : "#F00"
                      }
                      style={{
                        marginLeft: 10,
                        marginBottom: 15,
                      }}
                    >
                      {e?.verification.at(-1).status?.toUpperCase()}
                    </Tag>
                  </div>

                  <Typography.Text type="secondary">
                    {e?.address}
                  </Typography.Text>
                  <br />
                  <Space>
                    <Card onClick={() => fetchData("request", e._id)} hoverable>
                      <Statistic
                        title="Request"
                        value={e?.totalRequests > 99 ? "99+" : e?.totalRequests}
                      />
                    </Card>
                    <Card onClick={() => fetchData("tenants", e._id)} hoverable>
                      <Statistic title="Tenants" value={e?.totalSpaceRented} />
                    </Card>
                    <Card hoverable>
                      <Statistic
                        title="Rooms"
                        value={`${e?.totalSpaceRented} / ${e?.totalSpaceForRent}`}
                      />
                    </Card>
                  </Space>
                </>
              )}
              {openedTab == "Images" && (
                <>
                  <Typography.Title level={5}>
                    Establishment Photos
                  </Typography.Title>{" "}
                  <Carousel
                    autoplaySpeed={2000}
                    style={{ width: 500, marginTop: 10 }}
                    autoplay
                  >
                    {e?.establishmentPhotos?.length > 0 ? (
                      e?.establishmentPhotos.map((_, i) => (
                        <Image src={_} width={500} key={i} alt="image1" />
                      ))
                    ) : (
                      <NoImage />
                    )}
                  </Carousel>
                  <br />
                  <Typography.Title level={5}>Business permit</Typography.Title>
                  {e?.businessPermitPhoto != null ? (
                    <Image
                      src={e?.businessPermitPhoto}
                      width={500}
                      alt="image2"
                    />
                  ) : (
                    <NoImage />
                  )}
                </>
              )}
            </Col>
            <Col span={4}>
              <Space direction="vertical">
                <Button
                  onClick={() =>
                    setOpenVerificationHistory({
                      open: true,
                      data: e?.verification,
                    })
                  }
                >
                  Verification History
                </Button>
                <Button
                  onClick={() => {
                    (async (_) => {
                      let { data } = await _.get(
                        "/api/landlord/get-establishments",
                        {
                          params: {
                            _id: e.ownerId._id,
                            name: e.name,
                          },
                        }
                      );
                      setReport({
                        open: true,
                        data:
                          data?.establishment?.length > 0
                            ? data.establishment[0].tenants.map(
                                (e) => e.studentId
                              )
                            : [],
                        title: `Masterlist of All Student in ${e?.name}`,
                      });
                    })(axios);
                  }}
                >
                  Generate Report
                </Button>
                <Button
                  onClick={() => {
                    (async (_) => {
                      let { data } = await _.get("/api/landlord/get-archive", {
                        params: {
                          establishmentId: e._id,
                        },
                      });
                      if (data.status == 200) {
                        setOpenStudentProfile({
                          open: true,
                          data: data.archiveStudent,
                        });
                      }
                    })(axios);
                  }}
                >
                  View Archives
                </Button>
                <Space>
                  <Button icon={<SettingOutlined />} type="primary">
                    Edit
                  </Button>
                  <Popconfirm
                    title="This action is irreversible. Are you sure?"
                    okType="danger"
                    okText="Confirm"
                    placement="topLeft"
                    onConfirm={() =>
                      setOpenDeleteEstablishmentForm({ open: true, id: e?._id })
                    }
                  >
                    <Button icon={<DeleteOutlined />} danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </Space>
            </Col>
          </Row>
        ),
        key: i,
        closable: false,
      };
    });
  };

  useEffect(() => {
    (async () => {
      setLoader("init");
      let { data } = await axios.get("/api/landlord/get-establishments", {
        params: {
          _id: JSON.parse(Cookies.get("currentUser"))._id,
        },
      });

      if (data.status == 200) setEstablishment(data.establishment);
      else message.error(data.message);
      setLoader("");
    })();
  }, [trigger]);

  return (
    <>
      <ReportGenerator
        {...report}
        columns={column}
        close={() => setReport({ open: false, data: [], title: "" })}
      />
      <ArchiveTable
        {...openStudentProfile}
        close={() => setOpenStudentProfile({ open: false, data: null })}
        appkey={app_key}
      />
      <Spin spinning={loader == "init"}>
        {establishment.length > 0 && (
          <Tabs
            type="editable-card"
            items={updatedTabData(establishment)}
            tabBarStyle={{ borderBottom: "1px solid #cecece" }}
            onEdit={(targetKey, action) =>
              setOpenNewEstablishment(action == "add")
            }
          />
        )}
        {establishment.length == 0 && (
          <Button type="primary" onClick={() => setOpenNewEstablishment(true)}>
            New Establishment
          </Button>
        )}
        {/* UTILS */}
        <NewEstablishment
          open={openNewEstablishment}
          close={() => setOpenNewEstablishment(false)}
          refresh={() => setTrigger(trigger + 1)}
          app_key={app_key}
        />
        <ModalTable
          open={openTable.open}
          close={() => setOpenTable({ open: false, data: null })}
          data={openTable.data}
          refresh={() => setTrigger(trigger + 1)}
        />
        <VerificationHistory
          open={openVerificationHistory.open}
          close={() => setOpenVerificationHistory({ open: false, data: null })}
          data={openVerificationHistory.data}
        />
        <DeleteForm
          open={openDeleteEstablishmentForm.open}
          close={() =>
            setOpenDeleteEstablishmentForm({ open: false, id: null })
          }
          id={openDeleteEstablishmentForm.id}
          refresh={() => setTrigger(trigger + 1)}
        />
      </Spin>
    </>
  );
};

export default Establishment;
