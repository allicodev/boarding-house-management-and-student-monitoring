import React, { useEffect, useState } from "react";
import { Button, Drawer, Space, Modal, Spin, message } from "antd";
import { EstablishmentInfo } from "../../../../assets/utilities";
import axios from "axios";
import Cookies from "js-cookie";

const FullViewer = ({ data, open, close }) => {
  const [modal, contextHolder] = Modal.useModal();
  let _modal = null;

  let [loader, setLoader] = useState("");
  let [currentUser, setCurrentUser] = useState({});

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

  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, [data]);

  return (
    <>
      <Drawer
        open={open}
        onClose={close}
        placement="bottom"
        height="100%"
        title={data?.name}
        extra={[
          <Button
            type="primary"
            key="key1"
            onClick={() => {
              _modal = modal.confirm({
                title: "Confirm Request?",
                width: 370,
                centered: true,
                maskClosable: true,
                footer: [
                  <Spin spinning={loader != ""} key="footer-key-1">
                    <Space style={{ marginTop: 30 }}>
                      <Button>CANCEL</Button>
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
            }}
          >
            Apply for Request
          </Button>,
        ]}
      >
        <EstablishmentInfo data={data} />
      </Drawer>

      {/* UTILS */}
      {contextHolder}
    </>
  );
};

export default FullViewer;
