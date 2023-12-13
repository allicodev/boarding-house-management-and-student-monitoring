import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Card,
  message,
  Typography,
  Button,
  Input,
  Image,
  Row,
  Col,
  Tooltip,
  Divider,
} from "antd";
import SignatureCanvas from "react-signature-canvas";

import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import { BsClockHistory } from "react-icons/bs";
import dayjs from "dayjs";
import axios from "axios";
import Cookies from "js-cookie";

import { StudentHistory } from "../../../../assets/utilities";

const StudentProfile = ({ open, close, data, update, refresh }) => {
  const [loader, setLoader] = useState("");
  const [reason, setReason] = useState("");
  const [openDeclinedModal, setOpenDeclinedModal] = useState(false);
  const [openHistory, setOpenHistory] = useState({ open: false, history: [] });
  const [currentUser, setCurrentUser] = useState();
  const signatureRef = useRef(null);

  const confirm = () => {
    if (signatureRef.current.isEmpty()) {
      message.warning("Please provide a signature before confirming.");
      return;
    }
    (async (_) => {
      setLoader("saving");
      let res = await _.post("/api/request/accept-request", {
        _id: data?._id,
        studentId: data?.studentId?._id,
        landlordSignature: signatureRef.current.toDataURL(),
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
    })(axios);
  };

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

    if (data != null) {
      setOpenHistory({ open: false, history: data?.studentId?.history });
    }

    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, [data]);

  return (
    <>
      <StudentHistory
        open={openHistory.open}
        close={() => setOpenHistory({ open: false, history: [] })}
        data={openHistory.history}
        viewOnly={true}
      />
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
            <Button
              key="history"
              type="primary"
              ghost
              icon={<BsClockHistory />}
              onClick={() => {
                setOpenHistory({ open: true, history: openHistory.history });
                close();
              }}
            >
              View History
            </Button>,
          ]}
        >
          <Card.Meta
            title={data?.studentId?.firstName + " " + data?.studentId?.lastName}
            description={
              <>
                <Typography.Paragraph>
                  Requeston on {dayjs(data?.createdAt).format("MMMM D, YYYY")}
                  <br />
                  Student ID: {data?.studentId?.idNumber}
                  <br />
                  email: {data?.studentId?.email}
                  <br />
                  contact num: {data?.studentId?.phoneNumber}
                </Typography.Paragraph>
                <br />
                <strong>SIGNATURE</strong>
                <br />
                <Row gutter={[32, 32]}>
                  <Col span={12}>
                    <Image
                      preview={false}
                      src={`data:image/png;base64,${data?.studentSignature
                        .split("base64")[1]
                        .replace(/=+$/, "")}`}
                      style={{ border: "1px solid #eee" }}
                    />
                    <p style={{ textAlign: "center", marginTop: 13 }}>
                      {data?.studentId?.firstName +
                        " " +
                        data?.studentId?.lastName}
                    </p>
                    <Divider
                      style={{
                        padding: 0,
                        margin: 0,
                        backgroundColor: "#000",
                      }}
                    />
                    <p style={{ textAlign: "center" }}>Tenant</p>
                  </Col>
                  <Col span={12}>
                    <div>
                      <div style={{ position: "relative" }}>
                        <SignatureCanvas
                          penColor="black"
                          canvasProps={{
                            width: 200,
                            height: 200,
                            className: "signatureCanvas",
                            style: {
                              border: "1px solid #eee",
                            },
                          }}
                          ref={signatureRef}
                        />
                        <Tooltip title="reset">
                          <Button
                            icon={<UndoOutlined />}
                            style={{ position: "absolute", top: 3, left: 3 }}
                            onClick={() => signatureRef.current?.clear()}
                          />
                        </Tooltip>
                      </div>
                      <p style={{ textAlign: "center" }}>
                        {currentUser?.firstName + " " + currentUser?.lastName}
                      </p>
                      <Divider
                        style={{
                          padding: 0,
                          margin: 0,
                          backgroundColor: "#000",
                        }}
                      />
                      <p style={{ textAlign: "center" }}>Landlord/Landlady</p>
                    </div>
                  </Col>
                </Row>
              </>
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
