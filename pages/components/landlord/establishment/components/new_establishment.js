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
  Radio,
  message,
  Select,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";
import { PickerDropPane } from "filestack-react";
import LandlordTermsCondition from "../../../../assets/utilities/landlord_terms_conditions";

const NewEstablishment = ({ app_key, open, close, refresh }) => {
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState([]);
  const [businessPermitPhoto, setBusinessPermitPhoto] = useState();
  const [firstPayment, setFirstPayment] = useState("do");
  const [firstPaymentRule, setFirstPaymentRule] = useState("Deposit Only");
  const [loading, setLoading] = useState([]);
  const [openTermsCondition, setOpenTermsCondition] = useState({
    open: false,
    name: "",
  });

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
      firstPaymentRule,
    };

    let { data } = await axios.post("/api/landlord/create-establishment", {
      ...val,
    });

    if (data.status == 200) {
      message.success(data.message);
      close();
      refresh();
      setPhotos([]);
    } else message.error(data.message);
  };

  const addLoading = (str) =>
    setLoading(() => {
      return [...loading, str];
    });

  const removeLoading = (str) => {
    loading.splice(loading.indexOf(str), 1);
    setLoading(loading);
  };

  return (
    <>
      <LandlordTermsCondition
        {...openTermsCondition}
        close={() => setOpenTermsCondition({ open: false, name: "" })}
        onProceed={form.submit}
      />
      <Modal
        open={open}
        onCancel={() => {
          close();
          form.resetFields();
        }}
        closable={false}
        title="Add New Establishment"
        footer={
          <Button
            type="primary"
            onClick={() =>
              setOpenTermsCondition({
                open: true,
                name:
                  JSON.parse(Cookies.get("currentUser")).firstName +
                  " " +
                  JSON.parse(Cookies.get("currentUser")).lastName,
              })
            }
            loading={
              loading.filter((e) => e == "uploading-bp" || e == "uploading-img")
                .length > 0
            }
          >
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
          <Form.Item label="Establishment Type" name="type">
            <Select
              mode="multiple"
              style={{
                width: "100%",
              }}
              optionLabelProp="label"
              placeholder="Select one type"
            >
              {["Pad", "Boarding House", "Bed Spacer", "Dormitory"].map((e) => (
                <Select.Option key={e} value={e}>
                  {e}
                </Select.Option>
              ))}
            </Select>
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
          <Form.Item
            label="First Payment Rule"
            rules={[
              {
                required: true,
                message: "Please provide on this field",
              },
            ]}
          >
            <Radio.Group
              defaultValue={firstPayment}
              onChange={(e) => {
                setFirstPayment(e.target.value);
                if (e.target.value == "do") setFirstPaymentRule("Deposit Only");
              }}
            >
              <Radio value="do">Deposit Only</Radio>
              <Radio value="aad">Advance and Deposit</Radio>
            </Radio.Group>
            <br />
            {firstPayment == "aad" && (
              <>
                Deposit Month:{" "}
                <InputNumber
                  style={{ width: 100 }}
                  controls={false}
                  min={1}
                  onChange={(e) =>
                    setFirstPaymentRule(`Deposit and ${e} Months Advance`)
                  }
                />
              </>
            )}
          </Form.Item>
          <Form.Item label="Inclusions" name="inclusions">
            <Select mode="tags"></Select>
          </Form.Item>
          <Form.Item label="Restrictions" name="restrictions">
            <Select mode="tags"></Select>
          </Form.Item>
          <Form.Item label="Images (max: 3)">
            <div
              style={{ width: 255, cursor: "pointer", marginBottom: 10 }}
              id="picker-container"
            >
              {photos.length < 3 ? (
                <PickerDropPane
                  apikey={app_key}
                  onUploadDone={(res) => {
                    setPhotos([
                      ...photos,
                      ...res?.filesUploaded.map((_) => _.url),
                    ]);
                  }}
                  pickerOptions={{
                    container: "picker-container",
                    maxFiles: 3,
                  }}
                />
              ) : null}
            </div>
            {photos.map((_, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  position: "relative",
                  width: 480,
                  marginBottom: 10,
                }}
              >
                <div style={{ position: "relative" }}>
                  <Image
                    src={_}
                    alt="random_photo"
                    width="100%"
                    style={{ padding: 5 }}
                  />
                  <Button
                    shape="round"
                    style={{
                      position: "absolute",
                      zIndex: 999,
                      aspectRatio: 1 / 1,
                      padding: 0,
                      width: 32,
                      right: 5,
                      top: 5,
                    }}
                    onClick={() => {
                      setPhotos(() => photos.filter((_, i) => index != i));
                    }}
                    danger
                  >
                    X
                  </Button>
                </div>
              </div>
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
                  pickerOptions={{
                    container: "picker-container2",
                  }}
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
                <div style={{ position: "relative" }}>
                  <Image
                    src={businessPermitPhoto}
                    alt="random_photo"
                    width="100%"
                  />
                  <Button
                    shape="round"
                    style={{
                      position: "absolute",
                      zIndex: 999,
                      aspectRatio: 1 / 1,
                      padding: 0,
                      width: 32,
                      right: 5,
                      top: 5,
                    }}
                    onClick={() => setBusinessPermitPhoto(null)}
                    danger
                  >
                    X
                  </Button>
                </div>
              </div>
            ) : null}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NewEstablishment;
