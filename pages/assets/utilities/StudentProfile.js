import React from "react";
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
} from "antd";
import json from "../json/constant.json";
import dayjs from "dayjs";

const StudentProfile = ({ open, close, data }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      title="Student Profile"
      width={700}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Space direction="vertical">
            <Image src={data?.profilePhoto} />
          </Space>
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
                json.colleges.filter((e) => e.value == data?.college)[0]?.label
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
          <Tag color={data?.gender == "male" ? "blue-inverse" : "pink-inverse"}>
            {data?.gender}
          </Tag>
          <Tag>
            {json.year.filter((e) => e.value == parseInt(data?.year))[0]?.label}
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
  );
};

export default StudentProfile;
