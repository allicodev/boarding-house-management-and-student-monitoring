import React, { useEffect, useState } from "react";
import { Modal, Card, message, Typography, Button, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

const StudentProfile = ({ open, close, data, update, refresh }) => {
  const [loader, setLoader] = useState("");
  const [reason, setReason] = useState("");
  const [openDeclinedModal, setOpenDeclinedModal] = useState(false);

  const confirm = () =>
    (async () => {
      setLoader("saving");
      let res = await axios.post("/api/request/accept-request", {
        _id: data?._id,
        studentId: data?.studentId?._id,
      });

      if (res.data.status == 200) {
        message.success(res.data.message);
        if (![null, "", undefined].includes(data?.studentId?.email))
          (async (_) => {
            await _.post("/api/user/mail", {
              subject: "Request accepted",
              toEmail: data?.studentId?.email,
              html: "<div>Request is accepted by the landlord/landlady</div>",
            });
          })(axios);
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
      let res = await axios.post("/api/request/decline-request", {
        _id: data?._id,
        declineReason: reason,
        studentEmail: data?.studentId?.email,
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

  useEffect(() => {
    (async () => {
      let res = await axios.get("/api/request/seen", {
        params: {
          _id: data?._id,
        },
      });

      if (res.data.status == 200) update();
    })();
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        onCancel={close}
        closable={false}
        footer={null}
        style={{ padding: 0 }}
        centered
      >
        <Card
          cover={
            data?.studentId?.profilePhoto != null ? (
              <img alt="example" src={data?.studentId?.profilePhoto} />
            ) : null
          }
          actions={[
            <Button
              key="confirm"
              style={{ width: "95%", borderColor: "#87d068", color: "#87d068" }}
              icon={<CheckOutlined style={{ color: "#87d068" }} />}
              onClick={confirm}
              loading={loader == "saving"}
            >
              ACCEPT
            </Button>,
            <Button
              key="declined"
              style={{ width: "95%", borderColor: "#ff0000", color: "#ff0000" }}
              icon={<CloseOutlined style={{ color: "#ff0000" }} />}
              onClick={() => setOpenDeclinedModal(true)}
            >
              REJECT
            </Button>,
          ]}
        >
          <Card.Meta
            title={data?.studentId?.firstName + " " + data?.studentId?.lastName}
            description={
              <Typography.Paragraph>
                Requeston on {dayjs(data?.createdAt).format("MMMM D, YYYY")}
                <br />
                Student ID: {data?.studentId?.idNumber}
                <br />
                email: {data?.studentId?.email}
                <br />
                contact num: {data?.studentId?.phoneNumber}
              </Typography.Paragraph>
            }
          />
        </Card>
      </Modal>

      {/* UTILS */}
      <Modal
        title="Reason for Decline"
        okText="Submit"
        onOk={cancel}
        open={openDeclinedModal}
        onCancel={() => setOpenDeclinedModal(false)}
      >
        <Input.TextArea
          placeholder="This is optional"
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default StudentProfile;
