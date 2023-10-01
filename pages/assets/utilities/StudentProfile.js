import React, { useState } from "react";
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
import json from "../json/constant.json";
import EditStudentInfo from "./EditStudentInfo";

import { UserOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

const StudentProfile = ({ open, close, data, appkey, refresh }) => {
  const [openEdit, setOpenEdit] = useState({ open: false, data: null });

  return (
    <>
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
        title={
          <Space>
            <Typography.Text>Student Profile</Typography.Text>
            <Button onClick={() => setOpenEdit({ open: true, data })}>
              EDIT
            </Button>
          </Space>
        }
        width={700}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            {["", null, undefined].includes(data?.profilePhoto) ? (
              <div style={{ display: "grid", marginTop: 50 }}>
                <UserOutlined
                  style={{ fontSize: 150, justifySelf: "center" }}
                />
                <br />
                <small style={{ textAlign: "center" }}>No Image</small>
              </div>
            ) : (
              <Image src={data?.profilePhoto} />
            )}
          </Col>
          <Col span={12}>
            <Divider plain>
              <strong>Basic Info</strong>
            </Divider>
            <Typography.Text style={{ marginBottom: 0, fontSize: "1.25em" }}>
              {data?.firstName} {data?.lastName}{" "}
            </Typography.Text>
            <small>(id: {data?.idNumber})</small>
            <br />
            {![null, undefined, ""].includes(data?.college) && (
              <Tooltip
                title={
                  json.colleges.filter((e) => e.value == data?.college)[0]
                    ?.label
                }
              >
                <Tag
                  color={
                    json.colleges.filter((e) => e.value == data?.college)[0]
                      ?.color
                  }
                >
                  {data.college?.toUpperCase()}
                </Tag>
              </Tooltip>
            )}
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
