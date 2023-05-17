import React, { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";

const ChangePassword = ({ open, close, openEditModal }) => {
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });

  const handleFinish = async (val) => {
    if (Object.values(val).filter((e) => e == undefined).length > 0) {
      message.error("Please fill blank fields");
      return;
    }

    const { confirmPassword, newPassword, oldPassword } = val;

    if (confirmPassword != newPassword) {
      message.error("New Password and Confirm Password didn't match");
      return;
    }
    let { data } = await axios.post("/api/auth/password-reset", {
      id: openEditModal.data._id,
      oldPassword,
      newPassword,
    });

    if (data.status != 200) {
      message.error(data.message);
    } else {
      message.success(data.message);
      setUpdated(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      footer={
        <Button disabled={!updated} onClick={() => form.submit()}>
          SAVE
        </Button>
      }
    >
      <Form
        layout="vertical"
        onChange={() => setUpdated(true)}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item label="Old Password" name="oldPassword">
          <Input.Password />
        </Form.Item>
        <Form.Item label="New Password" name="newPassword">
          <Input.Password
            onChange={(e) =>
              setPasswords({
                newPass: e.target.value,
                confirmPass: passwords.confirmPass,
              })
            }
          />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirmPassword">
          <Input.Password
            onChange={(e) =>
              setPasswords({
                newPass: passwords.newPass,
                confirmPass: e.target.value,
              })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
