import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Tag, Tooltip, Typography, message } from "antd";
import {
  ExportOutlined,
  FieldTimeOutlined,
  CheckOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ContentWithSteps from "./content_with_steps";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const RequestHistory = () => {
  const [openReasonModal, setOpenReasonModal] = useState({
    open: false,
    data: null,
  });
  const [openHistory, setOpenHistory] = useState({ open: false, data: null });
  const [request, setRequest] = useState([]);
  const [trigger, setTrigger] = useState(0);
  let currentUser = JSON.parse(Cookies.get("currentUser") ?? "{}");

  const columns = [
    // { title: "id", dataIndex: "_id" },
    {
      title: "Name of Place",
      render: (_, row) =>
        row?.establishmentId?.name ?? (
          <Typography.Text type="secondary" italic>
            Establishment has been deleted
          </Typography.Text>
        ),
    },
    {
      title: "Application Status",
      align: "center",
      render: (_, row) =>
        row?.status == "accepted" ? (
          <Tag color="#87d068">
            <CheckOutlined /> ACCEPTED
          </Tag>
        ) : row?.status == "draft" ? (
          <Tag color="#87CEEB">
            <EditOutlined /> DRAFT
          </Tag>
        ) : row?.status == "pending" ? (
          <Tag color="#108ee9">
            <FieldTimeOutlined /> PENDING
          </Tag>
        ) : (
          <Tooltip title="Click to know the reason">
            <Tag
              color="#ff0000"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenReasonModal({
                  open: true,
                  data: row,
                });
              }}
            >
              <CloseOutlined /> DECLINED
            </Tag>
          </Tooltip>
        ),
    },
    {
      title: "Application Date",
      render: (_, row) => dayjs(row?.createdAt).format("MMMM D, YYYY"),
    },
    {
      width: 100,
      render: (_, row) => (
        <Button
          type="link"
          onClick={() => setOpenHistory({ open: true, data: row })}
        >
          Open Request History <ExportOutlined />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/request/get-request", {
        params: {
          studentId: currentUser?._id,
        },
      });
      if (data.status == 200) setRequest(data.data);
      else message.error(data.message);
    })();
  }, [trigger]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={request}
        pagination={false}
        rowKey={(_) => _._id}
        onRow={(data) => {
          return {
            onClick: () => setOpenHistory({ open: true, data }),
          };
        }}
      />

      {/* UTILS */}
      <Modal
        open={openReasonModal.open}
        onCancel={() => setOpenReasonModal({ open: false, data: null })}
        footer={null}
        closable={false}
        destroyOnClose
      >
        <Typography.Title level={4}>
          {openReasonModal.data?.establishmentId?.name}{" "}
          <Typography style={{ color: "#a1a1a1" }}>
            <small>(request id: {openReasonModal?.data?._id})</small>
          </Typography>
        </Typography.Title>
        <Typography.Paragraph>
          Reason: <br />
          {openReasonModal?.data?.declineReason}
        </Typography.Paragraph>
      </Modal>

      <Modal
        open={openHistory.open}
        onCancel={() => setOpenHistory({ open: false, data: null })}
        width={1200}
        closable={false}
        footer={null}
        destroyOnClose
      >
        <ContentWithSteps
          data={openHistory.data}
          close={() => setOpenHistory({ open: false, data: null })}
          refresh={() => setTrigger(trigger + 1)}
        />
      </Modal>
    </>
  );
};

export default RequestHistory;
