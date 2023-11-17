import React, { useEffect, useState } from "react";
import { Button, Drawer, Space, Modal, Spin, message, Typography } from "antd";
import { EstablishmentInfo } from "../../../../assets/utilities";
import axios from "axios";
import Cookies from "js-cookie";

import GuestForm from "./GuestForm";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const FullViewer = ({ data, open, close }) => {
  const [modal, contextHolder] = Modal.useModal();
  let [loader, setLoader] = useState("");
  let [currentUser, setCurrentUser] = useState({});
  let [status, setStatus] = useState("");
  let [alreadyAccepted, setAlreadyAccepted] = useState(false);
  const [openGuestForm, setOpenGuestForm] = useState(false);

  const _modal = null;

  const confirm = () => {
    setLoader("loading");
    (async () => {
      let res = await axios.post("/api/request/confirm-request", {
        studentId: currentUser?._id,
        establishmentId: data?._id,
      });
      if (res.data?.status == 200) {
        message.success(res.data.message);
        setLoader("");
        _modal.destroy();
        setStatus("pending");
      } else {
        setLoader("");
        _modal.destroy();
      }
    })();
  };

  const saveAsDraft = () =>
    (async () => {
      setLoader("loading");
      let res = await axios.post("/api/request/save-draft", {
        studentId: currentUser?._id,
        establishmentId: data?._id,
      });

      if (res.data?.status == 200) {
        message.success(res.data.message);
        setLoader("");
        _modal.destroy();
      } else {
        setLoader("");
        _modal.destroy();
      }
    })();

  const extraButtons = (_) => {
    let comp = (
      <Button
        type="primary"
        key="key1"
        onClick={() => {
          if (Object.keys(user).length != 0) {
            _modal = modal.confirm({
              title: "Confirm Request?",
              width: 370,
              centered: true,
              maskClosable: true,
              footer: [
                <Spin spinning={loader != ""} key="footer-key-1">
                  <Space style={{ marginTop: 30 }}>
                    <Button onClick={() => _modal.destroy()}>CANCEL</Button>
                    <Button
                      style={{
                        color: "green",
                        borderColor: "green",
                        background: "rgba(0,255,0,0.1)",
                      }}
                      onClick={saveAsDraft}
                    >
                      SAVE AS DRAFT
                    </Button>
                    <Button type="primary" onClick={confirm}>
                      CONFIRM
                    </Button>
                  </Space>
                </Spin>,
              ],
            });
          } else setOpenGuestForm(true);
        }}
      >
        Apply for Request
      </Button>
    );

    switch (_) {
      case "pending": {
        comp = (
          <Typography.Text type="secondary" italic>
            Already requested
          </Typography.Text>
        );
        break;
      }
      case "accepted": {
        comp = (
          <Typography.Text type="success">Accepted Already</Typography.Text>
        );
        break;
      }
      case "draft": {
        comp = (
          <Typography.Text type="warning" italic>
            Draft
          </Typography.Text>
        );
      }
    }

    return comp;
  };

  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("currentUser") ?? "{}"));
  }, [data]);

  useEffect(() => {
    if (open) {
      (async (_) => {
        if (user?.role == "student") {
          let res = await _.get("/api/student/check-is-tenant", {
            params: {
              studentId: currentUser?._id,
            },
          });

          if (res.data.status == 200) setAlreadyAccepted(true);

          let res2 = await _.get("/api/request/check-request", {
            params: {
              studentId: currentUser?._id,
              establishmentId: data?._id,
            },
          });

          if (res2.data.status == 200) setStatus(res2.data.request);
        }
      })(axios);
    }
  }, [open]);

  return (
    <>
      <GuestForm
        open={openGuestForm}
        close={() => setOpenGuestForm(false)}
        establishmentId={data?._id}
      />
      <Drawer
        open={open}
        onClose={close}
        placement="bottom"
        height="100%"
        title={data?.name}
        bodyStyle={{
          backgroundColor: "#FFD580",
        }}
        extra={[
          !alreadyAccepted ? (
            extraButtons(status)
          ) : (
            <Typography.Text type="success">Accepted Already</Typography.Text>
          ),
        ]}
        destroyOnClose
      >
        <EstablishmentInfo data={data} />
      </Drawer>

      {/* UTILS */}
      {contextHolder}
    </>
  );
};

export default FullViewer;
