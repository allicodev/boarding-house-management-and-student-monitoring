import React from "react";
import { Divider, List, Modal, Tag, Typography } from "antd";
import dayjs from "dayjs";

const VerificationHistory = ({ open, close, data }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      title="Verification History"
      destroyOnClose
    >
      <List
        dataSource={data}
        renderItem={(e, i) => (
          <List.Item key={i}>
            <Tag
              color={
                e?.status == "approved"
                  ? "#87d068"
                  : e?.status == "pending"
                  ? "#FFD580"
                  : "#F00"
              }
              style={{
                marginLeft: 10,
                marginBottom: 15,
              }}
            >
              {e?.status?.toUpperCase()}
            </Tag>
            {dayjs(e?.date).format("MMMM DD, YYYY")}
            <br />
            <Typography.Text style={{ marginLeft: 10 }}>
              {e?.text}
            </Typography.Text>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default VerificationHistory;
