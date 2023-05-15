import React, { useState } from "react";
import { Alert, Button, Form, Input, Modal } from "antd";

const ChangePassword = ({
  open,
  close,
  id,
  openEditModal,
  setOpenEditModal,
}) => {
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });

  const handleFinish = (val) => {};

  return (
    <Modal
      open={open}
      onCancel={() => {
        close();
        setOpenEditModal({ open: true, data: openEditModal });
      }}
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
        {passwords.newPass != passwords.confirmPass ||
          ((passwords.newPass != "" || passwords.confirmPass != "") && (
            <Alert
              message="New Password and Confirm Password didn't match"
              type="warning"
              showIcon
            />
          ))}
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
