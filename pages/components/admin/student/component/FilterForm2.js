import React, { useState } from "react";
import { Button, Modal, Select, Space, message } from "antd";
import jason from "../../../../assets/json/constant.json";

const EstabFilterForm = ({
  open,
  close,
  onFilterSubmit,
  //   onGenerateList,
  clearFilter,
}) => {
  const [status, setStatus] = useState("");

  const clear = () => {
    setStatus("");
    close();
  };

  return (
    <Modal
      open={open}
      onCancel={clear}
      width="25%"
      footer={
        <Space>
          <Button
            onClick={() => {
              message.success("Filter Cleared");
              clearFilter();
              clear();
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onFilterSubmit(status);
              message.success("Filters applied");
              clear();
            }}
          >
            Apply Filter
          </Button>
        </Space>
      }
      closable={false}
      destroyOnClose
    >
      <Space direction="vertical">
        <div>
          Status <br />
          <Select
            style={{ width: 300 }}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Declined", value: "declined" },
            ]}
            onSelect={(e) => setStatus(e)}
            value={status}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default EstabFilterForm;
