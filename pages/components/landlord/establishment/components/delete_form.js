import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const DeleteForm = ({ open, close, id, refresh }) => {
  const [password, setPassword] = useState("");

  const handleDelete = () => {
    (async (_) => {
      let { data } = await _.get("/api/landlord/check-pass", {
        params: {
          estabId: id,
          userId: user?._id,
          password,
        },
      });

      if (data.status == 200) {
        message.success(data.message);
        close();
        refresh();
      } else if (data.status == 401) {
        message.warning(data.message);
      } else message.error(data.message);
    })(axios);
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      title="Type your password for the confirmation of establishment deletion"
      destroyOnClose
      bodyStyle={{ display: "flex", flexDirection: "column" }}
    >
      <Input.Password
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        style={{ alignSelf: "self-end" }}
        onClick={handleDelete}
        disabled={password == ""}
        danger
      >
        Delete
      </Button>
    </Modal>
  );
};

export default DeleteForm;
