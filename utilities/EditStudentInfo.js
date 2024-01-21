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

import json from "../pages/assets/json/constant.json";

const EditStudentInfo = ({ open, close, data, appkey, closeAll }) => {
  const [image, setImage] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [form] = Form.useForm();
  const [inputData, setInputDate] = useState({});

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
    setSelectedCollege(data?.college);
    setInputDate(data);

    form.setFieldsValue({
      firstName: data?.firstName,
      lastName: data?.lastName,
      gender: data?.gender,
      dateOfBirth: dayjs(data?.dateOfBirth, "YYYY-MM-DD"),
      idNumber: data?.idNumber,
      college: data?.college,
      course: data?.course,
      year: parseInt(data?.year),
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    });
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
            {inputData?.profilePhoto == null ||
            inputData?.profilePhoto == "" ? (
              <PickerDropPane
                apikey={appkey}
                onUploadDone={(res) => {
                  setImage(res?.filesUploaded[0]?.url);
                  setUpdated(true);
                }}
                pickerOptions={{
                  container: "picker-container",
                  accept: "image/*",
                }}
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
        <Form.Item label="First Name" name="firstName">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName">
          <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Select
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            onChange={() => setUpdated(true)}
          />
        </Form.Item>
        <Form.Item label="Date of Birth" name="dateOfBirth">
          <DatePicker
            onChange={() => setUpdated(true)}
            defaultValue={dayjs(data?.dateOfBirth, "YYYY-MM-DD")}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item label="ID Number" name="idNumber">
          <Input />
        </Form.Item>

        <Form.Item label="College:" name="college">
          <Select
            options={json.colleges.map((e) => {
              return { label: e.label, value: e.value };
            })}
            onChange={() => setUpdated(true)}
          />
        </Form.Item>
        <Form.Item label="Course:" name="course">
          <Select
            options={
              json.colleges
                .filter((e) => e.value == selectedCollege)[0]
                ?.courses.map((e) => {
                  return { label: e, value: e };
                }) ?? []
            }
            placement="topLeft"
          />
        </Form.Item>
        <Form.Item label="Year" name="year">
          <Select options={json.year} onChange={() => setUpdated(true)} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input prefix="+63" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStudentInfo;
