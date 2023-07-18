import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import ChangePassword from "./change_password";

const EditProfile = ({ openEditModal, setOpenEditModal }) => {
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();
  const [openChangePassword, setOpenChangedPassword] = useState(false);

  const handleFinish = async (val) => {
    Object.values(val).forEach((e) => {
      if (e == undefined) {
        message.error("Please fill empty field.");
        return;
      }
    });
    let { data } = await axios.put("/api/user/update-info", {
      _id: openEditModal?.data?._id,
      ...val,
    });

    if (data?.status != 200) message.error(data?.message);
    else {
      message.success(data?.message);
      setUpdated(false);
    }
  };

  return (
    <>
      <Modal
        open={openEditModal?.open}
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
            initialValue={openEditModal?.data?.idNumber}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            initialValue={openEditModal?.data?.firstName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            initialValue={openEditModal?.data?.lastName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            initialValue={openEditModal?.data?.email}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            initialValue={openEditModal?.data?.phoneNumber}
          >
            <Input prefix="+63" />
          </Form.Item>
          <Button
            style={{ width: "100%", fontWeight: 700 }}
            onClick={() => {
              setOpenEditModal({ open: false, data: openEditModal?.data });
              setOpenChangedPassword(true);
            }}
          >
            CHANGE PASSWORD
          </Button>
        </Form>
      </Modal>
      <ChangePassword
        open={openChangePassword}
        close={() => {
          setOpenChangedPassword(false);
          setOpenEditModal({ open: true, data: openEditModal?.data });
        }}
        openEditModal={openEditModal}
      />
    </>
  );
};

export default EditProfile;
