import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Tooltip,
  Image,
  message,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";
import { PickerDropPane } from "filestack-react";

const NewEstablishment = ({ app_key, open, close, refresh }) => {
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState([]);
  const [businessPermitPhoto, setBusinessPermitPhoto] = useState();

  const [coords, setCoords] = useState([0, 0]);

  const handleFinish = async (val) => {
    // establishmentPhotos
    // businessPermitPhoto
    val = {
      ...val,
      coordinates: coords,
      ownerId: JSON.parse(Cookies.get("currentUser"))._id,
      establishmentPhotos: photos,
      businessPermitPhoto,
    };

    let { data } = await axios.post("/api/landlord/create-establishment", {
      ...val,
    });

    if (data.status == 200) {
      message.success(data.message);
      close();
      refresh();
    } else message.error(data.message);
  };
  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          close();
          form.resetFields();
        }}
        closable={false}
        title="Add New Establishment"
        footer={
          <Button type="primary" onClick={form.submit}>
            ADD NEW ESTABLISHMENT
          </Button>
        }
        centered
        destroyOnClose
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Coordinates">
            <Space>
              <InputNumber
                style={{ width: 100 }}
                placeholder="latitude"
                min={-90}
                max={90}
                controls={false}
                onChange={(e) => setCoords([coords[0], e])}
              />
              <InputNumber
                style={{ width: 100 }}
                placeholder="longitude"
                min={-180}
                max={180}
                controls={false}
                onChange={(e) => setCoords([e, coords[1]])}
              />

              <Tooltip title="click here on how to get coordinates">
                <Button
                  size="small"
                  icon={<InfoCircleOutlined />}
                  onClick={() =>
                    window.open(
                      "https://www.maps.ie/coordinates.html",
                      "_blank",
                      "noreferrer"
                    )
                  }
                />
              </Tooltip>
            </Space>
          </Form.Item>
          <Form.Item label="Images (max: 3)">
            <div
              style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
              id="picker-container"
            >
              {photos.length == 0 ? (
                <PickerDropPane
                  apikey={app_key}
                  onUploadDone={(res) => {
                    setPhotos(res?.filesUploaded.map((_) => _.url));
                  }}
                  pickerOptions={{ container: "picker-container", maxFiles: 3 }}
                />
              ) : null}
            </div>
            {photos.map((_, i) => (
              <>
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
                  <Image src={_} alt="random_photo" width="100%" />
                  {/* <Button
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
                      setPhotos(() => {
                        photos = photos.splice(i, 1);

                        return photos;
                      });
                    }}
                  >
                    X
                  </Button> */}
                </div>
              </>
            ))}
          </Form.Item>
          <Form.Item label="Business Permit">
            <div
              style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
              id="picker-container2"
            >
              {businessPermitPhoto == null || businessPermitPhoto == "" ? (
                <PickerDropPane
                  apikey={app_key}
                  onUploadDone={(res) => {
                    setBusinessPermitPhoto(res?.filesUploaded[0]?.url);
                  }}
                  pickerOptions={{ container: "picker-container2" }}
                />
              ) : null}
            </div>
            {businessPermitPhoto != null && businessPermitPhoto != "" ? (
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
                <Image
                  src={businessPermitPhoto}
                  alt="random_photo"
                  width="100%"
                />
                {/* <Button
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
                </Button> */}
              </div>
            ) : null}
          </Form.Item>
          <Form.Item
            label="Total Spaces to Rent"
            name="totalSpaceForRent"
            rules={[
              {
                required: true,
                message: "Please provide on this field",
              },
            ]}
          >
            <InputNumber style={{ width: 80 }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NewEstablishment;
