import React, { useState } from "react";
import { Button, Modal, Table, Tag, Tooltip, Typography } from "antd";
import {
  ExportOutlined,
  FieldTimeOutlined,
  CheckOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { mockData } from "../../../../assets/utilities";
import ContentWithSteps from "./content_with_steps";

const RequestHistory = () => {
  const [openReasonModal, setOpenReasonModal] = useState({
    open: false,
    data: null,
  });
  const [openHistory, setOpenHistory] = useState({ open: false, data: null });
  const columns = [
    { title: "id", dataIndex: "_id" },
    {
      title: "Name of Place",
      render: (_, row) => row?.selected_boarding_house.name,
    },
    {
      title: "Application Status",
      align: "center",
      render: (_, row) =>
        row?.status.at(-1)?.name == "accepted" ? (
          <Tag color="#87d068">
            <CheckOutlined /> ACCEPTED
          </Tag>
        ) : row?.status.at(-1)?.name == "draft" ? (
          <Tag color="#87CEEB">
            <EditOutlined /> DRAFT
          </Tag>
        ) : row?.status.at(-1)?.name == "pending" ? (
          <Tag color="#108ee9">
            <FieldTimeOutlined /> PENDING
          </Tag>
        ) : (
          <Tooltip title="Click to know the reason">
            <Tag
              color="#ff0000"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenReasonModal({
                  open: true,
                  data: row,
                })
              }
            >
              <CloseOutlined /> DECLINED
            </Tag>
          </Tooltip>
        ),
    },
    { title: "Application Date", render: (_, row) => row?.status[0].createdAt },
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
  return (
    <>
      <Table
        columns={columns}
        dataSource={mockData["student-request"]}
        pagination={false}
        rowKey={(_) => _._id}
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
          {openReasonModal.data?.selected_boarding_house?.name}{" "}
          <Typography style={{ color: "#a1a1a1" }}>
            <small>(request id: {openReasonModal?.data?._id})</small>
          </Typography>
        </Typography.Title>
        <Typography.Paragraph>
          Reason: <br />
          {openReasonModal?.data?.status.at(-1).reason}
        </Typography.Paragraph>
      </Modal>
      <Modal
        open={openHistory.open}
        onCancel={() => setOpenHistory({ open: false, data: null })}
        width={1000}
        closable={false}
        footer={null}
        destroyOnClose
      >
        <ContentWithSteps data={openHistory.data} />
      </Modal>
    </>
  );
};

export default RequestHistory;
