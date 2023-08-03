import React from "react";
import { Form, Input, Modal, message } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

const GuestForm = ({ open, close, establishmentId }) => {
  const [form] = Form.useForm();
  const handleFinish = (val) => {
    let submitAlready = Cookies.get("guestSubmit") == "true";

    if (submitAlready) {
      message.warning(
        "Already submitted. Please check your email for updates."
      );
      return;
    }

    (async (_) => {
      let { data } = await _.post("/api/student/new-guest", {
        ...val,
        establishmentId,
      });

      if (data.status == 200) {
        Cookies.set("guestSubmit", true);
        message.success(data.message);
        close();
      } else message.error(data.message);
    })(axios);
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      okText="SUBMIT"
      closable={false}
      onOk={() => form.submit()}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Student ID:"
          name="idNumber"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name:"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name:"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Email:" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact Number:"
          name="phoneNumber"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Profile Photo:">AGUY</Form.Item>
      </Form>
    </Modal>
  );
};

export default GuestForm;
