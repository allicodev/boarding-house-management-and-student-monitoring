import React from "react";
import { Button, Modal, Space } from "antd";

const LanlordSearchFilter = ({ open, close, openAs }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      footer={null}
      title="Open as"
      width={330}
    >
      <Space direction="vertical">
        <Button onClick={() => openAs("all-tenant")}>
          List of All Tenants per Establishment
        </Button>
      </Space>
    </Modal>
  );
};

export default LanlordSearchFilter;
