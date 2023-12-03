import React, { useEffect, useState } from "react";
import {
  Modal,
  Image,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
  Tag,
  Divider,
  Button,
} from "antd";
import Cookies from "js-cookie";
import json from "../json/constant.json";
import { EditStudentInfo, StudentHistory } from "./index";

import { UserOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

const StudentProfile = ({ open, close, data, appkey, refresh }) => {
  const [openEdit, setOpenEdit] = useState({ open: false, data: null });
  const [openHistory, setOpenHistory] = useState(false);
  const [id, setId] = useState("");
  const [history, setHistory] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (data != null) {
      setId(data?._id);
      setHistory(data?.history ?? []);
    }
    setRole(JSON.parse(Cookies.get("currentUser")).role ?? "");
  }, [data]);

  return (
    <>
      <StudentHistory
        open={openHistory}
        close={() => setOpenHistory(false)}
        data={history}
        id={id}
        refresh={() => refresh()}
      />
      <EditStudentInfo
        appkey={appkey}
        open={openEdit.open}
        close={() => setOpenEdit({ open: false, data: null })}
        data={openEdit.data}
        closeAll={() => {
          setOpenEdit({ open: false, data: null });
          close();
          refresh();
        }}
      />
      <Modal
        open={open}
        onCancel={close}
        footer={null}
        title={<Typography.Text>Student Profile</Typography.Text>}
        width={700}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {["", null, undefined].includes(data?.profilePhoto) ? (
                <div style={{ display: "grid", marginTop: 50 }}>
                  <UserOutlined
                    style={{ fontSize: 150, justifySelf: "center" }}
                  />
                </div>
              ) : (
                <Image src={data?.profilePhoto} />
              )}
              <Typography.Text style={{ marginBottom: 0, fontSize: "1.25em" }}>
                {data?.firstName} {data?.lastName}{" "}
              </Typography.Text>
              <small>(id: {data?.idNumber})</small>
            </div>
            <Space style={{ marginTop: 25 }}>
              {role == "admin" && (
                <Button
                  onClick={() => setOpenEdit({ open: true, data })}
                  icon={<EditOutlined />}
                >
                  EDIT
                </Button>
              )}
              <Button
                onClick={() => {
                  setOpenHistory(true);
                  close();
                }}
                icon={<FileAddOutlined />}
              >
                Add History
              </Button>
            </Space>
          </Col>
          <Col span={12}>
            <Divider plain>
              <strong>Basic Info</strong>
            </Divider>{" "}
            <Tag>
              {dayjs().diff(
                dayjs(data?.dateOfBirth).format("YYYY-MM-DD"),
                "years",
                false
              )}{" "}
              years old
            </Tag>
            <Tag
              color={data?.gender == "male" ? "blue-inverse" : "pink-inverse"}
            >
              {data?.gender}
            </Tag>
            <Tag>
              {
                json.year.filter((e) => e.value == parseInt(data?.year))[0]
                  ?.label
              }
            </Tag>
            <br />
            {![null, undefined, ""].includes(data?.college) && (
              <Tooltip
                title={`${
                  json.colleges.filter((e) => e.value == data?.college)[0]
                    ?.label
                }\n${data?.course ?? ""}`}
              >
                <Tag
                  color={
                    json.colleges.filter((e) => e.value == data?.college)[0]
                      ?.color
                  }
                  style={{ marginTop: 5 }}
                >
                  {data.college?.toUpperCase()}{" "}
                  {data?.course ? `(${data?.course})` : ""}
                </Tag>
              </Tooltip>
            )}
            <Divider plain>
              <strong>Contact</strong>
            </Divider>
            <Typography.Text>+63 {data?.phoneNumber}</Typography.Text>
            <br />
            <Typography.Text>{data?.email}</Typography.Text>
            <Divider plain>
              <strong>Establishment</strong>
            </Divider>
            {data?.tenant?.establishmentId?.name != null ? (
              <>
                <Typography.Title level={5}>
                  {data?.tenant?.establishmentId?.name}
                </Typography.Title>
                <Typography.Text type="secondary">
                  Joined at{" "}
                  {dayjs(data?.tenant?.createdAt).format("MMMM DD, YYYY")}
                </Typography.Text>
              </>
            ) : (
              <Typography.Text type="secondary" italic>
                No Data
              </Typography.Text>
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default StudentProfile;
