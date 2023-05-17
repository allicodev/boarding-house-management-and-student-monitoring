import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Tooltip,
  Upload,
  message,
} from "antd";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NewEstablishment = ({ open, close, refresh }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [businessPermitPhoto, setBusinessPermitPhoto] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [coords, setCoords] = useState([0, 0]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleFinish = async (val) => {
    // establishmentPhotos
    // businessPermitPhoto
    val = {
      ...val,
      coordinates: coords,
      ownerId: JSON.parse(Cookies.get("currentUser"))._id,
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
                placeholder="longitude"
                min={-180}
                max={180}
                controls={false}
                onChange={(e) => setCoords([e, coords[1]])}
              />
              <InputNumber
                style={{ width: 100 }}
                placeholder="latitude"
                min={-90}
                max={90}
                controls={false}
                onChange={(e) => setCoords([coords[0], e])}
              />
              <Tooltip title="click here on how to get coordinates">
                <Button size="small" icon={<InfoCircleOutlined />} />
              </Tooltip>
            </Space>
          </Form.Item>
          <Form.Item label="Images (max: 3)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={async (file) => {
                if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
                }
                setPreviewImage(file.url || file.preview);
                setPreviewOpen(true);
                setPreviewTitle(
                  file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
                );
              }}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              multiple
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item label="Business Permit">
            <Upload
              listType="picture-card"
              fileList={businessPermitPhoto}
              onPreview={async (file) => {
                if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
                }
                setPreviewImage(file.url || file.preview);
                setPreviewOpen(true);
                setPreviewTitle(
                  file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
                );
              }}
              onChange={({ fileList: newFileList }) =>
                setBusinessPermitPhoto(newFileList)
              }
              multiple
            >
              {businessPermitPhoto.length >= 1 ? null : uploadButton}
            </Upload>
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default NewEstablishment;
