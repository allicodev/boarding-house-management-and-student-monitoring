import React, { useState } from "react";
import {
  Button,
  Drawer,
  Input,
  Modal,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import { EstablishmentInfo } from "../../../../assets/utilities";
import VerificationHistory from "../../../landlord/establishment/components/verification_history";

const FullViewer = ({ data, open, close, verify, decline }) => {
  const [openDeclineForm, setOpenDeclineForm] = useState(false);
  const [reason, setReason] = useState("");
  const [openVerificationHistory, setOpenVerificationHistory] = useState({
    open: false,
    data: null,
  });
  return (
    <>
      <VerificationHistory
        open={openVerificationHistory.open}
        close={() => setOpenVerificationHistory({ open: false, data: null })}
        data={openVerificationHistory.data}
      />
      <Modal
        open={openDeclineForm}
        onCancel={() => setOpenDeclineForm(false)}
        footer={null}
        closable={false}
        title="Decline Form"
        bodyStyle={{ display: "flex", flexDirection: "column" }}
      >
        <Typography.Text>Reason: </Typography.Text>
        <Input.TextArea
          onChange={(e) => setReason(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <br />
        <Button
          type="primary"
          style={{ alignSelf: "self-end" }}
          onClick={() => {
            decline(data?._id, reason);
            setOpenDeclineForm(false);
          }}
        >
          SUBMIT
        </Button>
      </Modal>
      <Drawer
        open={open}
        onClose={close}
        placement="bottom"
        height="100%"
        title={data?.name}
        extra={[
          data?.verification?.at(-1).status == "pending" ? (
            <Space>
              <Button
                type="primary"
                key="key1"
                onClick={() => setOpenDeclineForm(true)}
                danger
              >
                Reject
              </Button>

              <Popconfirm
                title="Are you sure ?"
                okText="Confirm"
                onConfirm={() => verify(data?._id)}
              >
                <Button type="primary" key="key2">
                  Verify
                </Button>
              </Popconfirm>
            </Space>
          ) : data?.verification?.at(-1).status == "approved" ? (
            <Popconfirm
              title="Are you sure ?"
              okText="Confirm"
              onConfirm={() => decline(data?._id)}
            >
              <Button
                style={{
                  backgroundColor: "#FFD580",
                  color: "#fff",
                }}
              >
                Revoke
              </Button>
            </Popconfirm>
          ) : (
            <Button
              onClick={() =>
                setOpenVerificationHistory({
                  open: true,
                  data: data?.verification,
                })
              }
            >
              Verification History
            </Button>
          ),
        ]}
      >
        <EstablishmentInfo data={data} />
      </Drawer>
    </>
  );
};

export default FullViewer;
