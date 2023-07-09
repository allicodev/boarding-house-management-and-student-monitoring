import React, { useState } from "react";
import {
  Modal,
  Space,
  Table,
  Button,
  Popconfirm,
  Input,
  message,
  Typography,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

const ModalTable = ({ open, close, data, refresh }) => {
  const [loader, setLoader] = useState("");
  const [reason, setReason] = useState("");
  const [openDeclinedModal, setOpenDeclinedModal] = useState({
    open: false,
    id: -null,
  });

  const columns = [
    {
      title: "First Name",
      render: (_, row) =>
        row?.studentId?.firstName + " " + row?.studentId?.lastName,
    },
    {
      title: "ID Number",
      render: (_, row) => row?.studentId?.idNumber,
    },
    {
      title: "Date Requested",
      align: "center",
      render: (_, row) => dayjs(row?.createdAt).format("MMMM D, YYYY"),
    },
    {
      title: "Functions",
      align: "center",
      render: (_, row) =>
        row?.status == null ? (
          <Typography.Text type="secondary" italic>
            N/A
          </Typography.Text>
        ) : (
          <Space>
            <Popconfirm
              title="Request Confirmation"
              description="Are you sure to accept this request?"
              onConfirm={() => confirm(row?._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" loading={loader == "saving-accept"}>
                ACCEPT
              </Button>
            </Popconfirm>

            <Button
              danger
              loading={loader == "saving-delete"}
              onClick={() => setOpenDeclinedModal({ open: true, id: row?._id })}
            >
              DECLINE
            </Button>
          </Space>
        ),
    },
  ];

  const confirm = (id) =>
    (async () => {
      setLoader("saving-accept");
      let res = await axios.post("/api/request/accept-request", {
        _id: id,
      });

      if (res.data.status == 200) {
        message.success(res.data.message);
        close();
        setLoader("");
        refresh();
      } else {
        message.error(res.data.message);
        setLoader("");
      }
    })();

  const cancel = () =>
    (async () => {
      setLoader("saving-delete");
      let res = await axios.post("/api/request/decline-request", {
        _id: openDeclinedModal.id,
        declineReason: reason,
      });
      if (res.data.status == 200) {
        message.success(res.data.message);
        close();
        setLoader("");
        refresh();
        setOpenDeclinedModal(false);
      } else {
        message.error(res.data.message);
        setLoader("");
        setOpenDeclinedModal(false);
      }
    })();

  return (
    <>
      <Modal
        open={open}
        onCancel={close}
        closable={false}
        footer={null}
        width={700}
      >
        <Table dataSource={data} columns={columns} pagination={false} />
      </Modal>
      <Modal
        title="Reason for Decline"
        okText="Submit"
        onOk={cancel}
        open={openDeclinedModal.open}
        onCancel={() => setOpenDeclinedModal({ open: false, id: null })}
      >
        <Input.TextArea
          placeholder="This is optional"
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default ModalTable;
