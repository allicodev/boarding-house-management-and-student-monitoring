import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const EditProfile = ({
  openEditModal,
  setOpenEditModal,
  setOpenChangedPassword,
}) => {
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = (val) => {};

  return (
    <Modal
      open={openEditModal.open}
      onCancel={() => {
        setOpenEditModal({ open: false, data: null });
        setUpdated(false);
      }}
      title="Edit Profile"
      footer={
        <Button
          type="primary"
          disabled={!updated}
          onClick={() => form.submit()}
        >
          SAVE
        </Button>
      }
      destroyOnClose
    >
      <Form
        labelCol={{
          flex: "90px",
        }}
        labelAlign="left"
        labelWrap
        wrapperCol={{
          flex: 1,
        }}
        colon={false}
        form={form}
        onChange={() => setUpdated(true)}
        onFinish={handleFinish}
      >
        <Form.Item
          label="ID Number"
          name="idNumber"
          initialValue={openEditModal.data?.idNumber}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          initialValue={openEditModal.data?.firstName}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          initialValue={openEditModal.data?.lastName}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          initialValue={openEditModal.data?.email}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          initialValue={openEditModal.data?.phoneNumber}
        >
          <Input prefix="+63" />
        </Form.Item>
        <Button
          style={{ width: "100%", fontWeight: 700 }}
          onClick={() => {
            setOpenChangedPassword(true);
            setOpenEditModal(false);
          }}
        >
          CHANGE PASSWORD
        </Button>
      </Form>
    </Modal>
  );
};

export default EditProfile;
