import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Image,
  Select,
  message,
  DatePicker,
} from "antd";
import axios from "axios";
import ChangePassword from "./change_password";
import { PickerDropPane } from "filestack-react";
import Cookies from "js-cookie";

import json from "../../assets/json/constant.json";
import dayjs from "dayjs";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const EditProfile = ({ app_key, openEditModal, setOpenEditModal }) => {
  const [updated, setUpdated] = useState(false);
  const [form] = Form.useForm();
  const [openChangePassword, setOpenChangedPassword] = useState(false);
  const [image, setImage] = useState(openEditModal?.data?.profilePhoto);
  const [courses, setCourses] = useState([]);

  const handleFinish = async (val) => {
    delete val.profilephoto;
    console.log(val);

    if (Object.values(val).includes(undefined)) {
      message.error("Please fill empty field.");
      return;
    }

    let { data } = await axios.put("/api/user/update-info", {
      _id: openEditModal?.data?._id,
      profilePhoto: image,
      ...val,
    });
    if (data?.status == 500 && data.message.codeName == "DuplicateKey")
      message.warning("ID Number is taken by another user.");
    else if (data?.status != 200) message.error(data?.message);
    else {
      message.success(data?.message);
      Cookies.set("currentUser", JSON.stringify(data?.user));
      setUpdated(false);
    }
  };

  useEffect(() => {
    setImage(openEditModal?.data?.profilePhoto);
    setCourses(
      json.colleges
        .filter((e) => e.value == openEditModal?.data?.college)[0]
        ?.courses.map((e) => {
          return { label: e, value: e };
        }) ?? []
    );
  }, [openEditModal]);

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
            label="Profile Photo"
            name="profilephoto"
            style={{ marginBottom: 0 }}
          >
            <div
              style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
              id="picker-container"
            >
              {image == null || image == "" ? (
                <PickerDropPane
                  apikey={app_key}
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
          {user?.role == "student" && (
            <Form.Item
              label="Gender"
              name="gender"
              initialValue={openEditModal?.data?.gender}
            >
              <Select
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                onChange={() => setUpdated(true)}
              />
            </Form.Item>
          )}
          {user?.role == "student" && (
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              initialValue={dayjs(
                openEditModal?.data?.dateOfBirth,
                "YYYY-MM-DD"
              )}
            >
              <DatePicker
                onChange={() => setUpdated(true)}
                defaultValue={dayjs(
                  openEditModal?.data?.dateOfBirth,
                  "YYYY-MM-DD"
                )}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}
          {user?.role == "student" && (
            <Form.Item
              label="ID Number"
              name="idNumber"
              initialValue={openEditModal?.data?.idNumber}
            >
              <Input />
            </Form.Item>
          )}

          {user?.role == "student" && (
            <Form.Item
              label="College:"
              name="college"
              initialValue={openEditModal?.data?.college}
            >
              <Select
                options={json.colleges}
                onChange={() => setUpdated(true)}
              />
            </Form.Item>
          )}
          {user?.role == "student" && (
            <Form.Item
              label="Course:"
              name="course"
              initialValue={openEditModal?.data?.course}
            >
              <Select options={courses} onChange={() => setUpdated(true)} />
            </Form.Item>
          )}
          {user?.role == "student" && (
            <Form.Item
              label="Year"
              name="year"
              initialValue={parseInt(openEditModal?.data?.year)}
            >
              <Select options={json.year} onChange={() => setUpdated(true)} />
            </Form.Item>
          )}
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
