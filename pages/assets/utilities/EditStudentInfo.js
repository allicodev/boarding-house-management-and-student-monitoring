import React, { useEffect, useState } from "react";
import {
  Form,
  Image,
  Button,
  Input,
  Select,
  Modal,
  DatePicker,
  message,
} from "antd";
import { PickerDropPane } from "filestack-react";
import dayjs from "dayjs";
import axios from "axios";
import Cookies from "js-cookie";

import json from "../json/constant.json";

const EditStudentInfo = ({ open, close, data, appkey, closeAll }) => {
  const [image, setImage] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = (val) => {
    (async (_) => {
      let res = await _.put("/api/user/update-info", {
        _id: data?._id,
        profilePhoto: image,
        ...val,
      });
      if (
        res?.data?.status == 500 &&
        res?.data.message.codeName == "DuplicateKey"
      )
        message.warning("ID Number is taken by another user.");
      else if (res?.data?.status != 200) message.error(res?.data?.message);
      else {
        message.success(res?.data?.message);
        Cookies.set("currentUser", JSON.stringify(res?.data?.user));
        setUpdated(false);
        closeAll();
      }
    })(axios);
  };

  useEffect(() => {
    setImage(data?.profilePhoto);
  }, [data]);

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={[
        <Button key="key-1" type="primary" onClick={() => form.submit()}>
          UPDATE
        </Button>,
      ]}
      closable={false}
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
        onChange={() => setUpdated(true)}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Profile Photo"
          name="profilephoto"
          style={{ marginBottom: 0 }}
        >
          <div
            style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
            id="picker-container"
          >
            {data?.profilePhoto == null || data?.profilePhoto == "" ? (
              <PickerDropPane
                apikey={appkey}
                onUploadDone={(res) => {
                  setImage(res?.filesUploaded[0]?.url);
                  setUpdated(true);
                }}
                pickerOptions={{ container: "picker-container" }}
              />
            ) : null}
          </div>

          {image != null && image != "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                width: 300,
                marginBottom: 10,
              }}
            >
              <Image src={image} alt="random_photo" width="100%" />
              <Button
                style={{
                  padding: 0,
                  fontSize: 15,
                  position: "absolute",
                  width: 30,
                  borderRadius: "100%",
                  aspectRatio: 1 / 1,
                  right: 5,
                  top: 5,
                }}
                danger
                onClick={() => {
                  setImage(null);
                }}
              >
                X
              </Button>
            </div>
          ) : null}
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          initialValue={data?.firstName}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          initialValue={data?.lastName}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender" initialValue={data?.gender}>
          <Select
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            onChange={() => setUpdated(true)}
          />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          initialValue={dayjs(data?.dateOfBirth, "YYYY-MM-DD")}
        >
          <DatePicker
            onChange={() => setUpdated(true)}
            defaultValue={dayjs(data?.dateOfBirth, "YYYY-MM-DD")}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item
          label="ID Number"
          name="idNumber"
          initialValue={data?.idNumber}
        >
          <Input />
        </Form.Item>

        <Form.Item label="College:" name="college" initialValue={data?.college}>
          <Select options={json.colleges} onChange={() => setUpdated(true)} />
        </Form.Item>
        <Form.Item label="Year" name="year" initialValue={parseInt(data?.year)}>
          <Select options={json.year} onChange={() => setUpdated(true)} />
        </Form.Item>
        <Form.Item label="Email" name="email" initialValue={data?.email}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          initialValue={data?.phoneNumber}
        >
          <Input prefix="+63" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStudentInfo;
