import React, { useEffect, useState } from "react";
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
import Cookies from "js-cookie";
import axios from "axios";
import { PickerDropPane } from "filestack-react";
import { TiArrowBack } from "react-icons/ti";

import {
  MapPicker,
  LandlordTermsCondition,
} from "../../../../assets/utilities";

const NewEstablishment = ({
  app_key,
  open,
  close,
  refresh,
  data,
  isEditMode,
}) => {
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState([]);
  const [businessPermitPhoto, setBusinessPermitPhoto] = useState();
  const [firstPayment, setFirstPayment] = useState("do");
  const [firstPaymentRule, setFirstPaymentRule] = useState("Deposit Only");
  const [loading, setLoading] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [enterManualAddress, setEnterManualAddress] = useState(false);
  const [signature, setSignature] = useState(null);
  const [openTermsCondition, setOpenTermsCondition] = useState({
    open: false,
    name: "",
  });
  const [coordsConfig, setCoorsConfig] = useState({
    coordinates: [],
    address: "",
  });
  const [addressConfig, setAddressConfig] = useState({
    address: "",
    coordinates: [],
  });

  const defaultCoordinates = { lat: 125.124651, long: 8.157851 }; //* malaybalay

  const handleFinish = async (val) => {
    const mode = isEditMode ? "update-establishment" : "create-establishment";

    val = {
      ...val,
      ...(enterManualAddress ? addressConfig : coordsConfig),
      ...(isEditMode ? { id: data?._id } : {}),
      ownerId: JSON.parse(Cookies.get("currentUser"))._id,
      signature,
      establishmentPhotos: photos,
      businessPermitPhoto,
      firstPaymentRule,
    };

    let res = await axios.post(`/api/landlord/${mode}`, val);

    if (res.data.status == 200) {
      message.success(res.data.message);
      close();
      refresh();
      setPhotos([]);
    } else message.error(res.data.message);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);

      setAddressConfig({
        address: data?.address ?? "",
        coordinates: data?.coordinates ?? [0, 0],
      });
      setEnterManualAddress(true);
      setPhotos(data?.establishmentPhotos);
      setBusinessPermitPhoto(data?.businessPermitPhoto);

      if (data?.firstPaymentRule?.split(" ")?.length > 2 ?? false) {
        setFirstPayment("aad");
        setFirstPaymentRule(data?.firstPaymentRule);
      } else setFirstPayment("do");
    }
  }, [data]);

  return (
    <>
      <Modal
        open={openMap}
        footer={null}
        closable={false}
        onCancel={() => setOpenMap(false)}
        zIndex={999}
        width={1000}
        className="remove-padding-modal"
        destroyOnClose
      >
        <MapPicker
          defaultCoordinates={defaultCoordinates}
          onsubmit={(coordinates, address) =>
            setCoorsConfig({ coordinates, address })
          }
          styles={{ height: 500 }}
          close={() => setOpenMap(false)}
        />
      </Modal>
      <LandlordTermsCondition
        {...openTermsCondition}
        close={() => setOpenTermsCondition({ open: false, name: "" })}
        onProceed={(signature) => {
          setSignature(signature);
          form.submit();
        }}
      />
      <Modal
        open={open}
        onCancel={() => {
          form.resetFields();
          setAddressConfig({ address: "", coordinates: [] });
          setCoorsConfig({ address: "", coordinates: [] });
          setEnterManualAddress(false);
          close();
        }}
        closable={false}
        title={isEditMode ? "Update Establishment" : "Add New Establishment"}
        zIndex={1}
        footer={
          <Button
            type="primary"
            onClick={async () => {
              if (enterManualAddress) {
                if (addressConfig.address == "") {
                  message.error("Address should be provided.");
                  return;
                }
              } else {
                if (coordsConfig.address == "") {
                  message.error("Address should be provided.");
                  return;
                }
              }

              await form
                .validateFields()
                .then(() => {
                  if (!isEditMode) {
                    setOpenTermsCondition({
                      open: true,
                      name:
                        JSON.parse(Cookies.get("currentUser")).firstName +
                        " " +
                        JSON.parse(Cookies.get("currentUser")).lastName,
                    });
                  } else {
                    form.submit();
                  }
                })
                .catch(() => {
                  message.error("Some input are blank. Please provide.");
                });
            }}
            loading={
              loading.filter((e) => e == "uploading-bp" || e == "uploading-img")
                .length > 0
            }
          >
            {isEditMode ? "UPDATE ESTABLISHMENT" : "ADD NEW ESTABLISHMENT"}
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
          <Form.Item label="Accommodation Type" name="type">
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
          <Form.Item label="Tenant Type" name="tenantType">
            <Select
              defaultValue="mix"
              options={[
                {
                  value: "male",
                  label: "Male",
                },
                {
                  value: "female",
                  label: "Female",
                },
                {
                  value: "mix",
                  label: "Mix",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Location">
            {enterManualAddress ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Space>
                  <Input
                    placeholder="Enter address"
                    style={{
                      width: 250,
                    }}
                    onChange={(e) =>
                      setAddressConfig({
                        ...addressConfig,
                        address: e.target.value,
                      })
                    }
                    value={addressConfig.address}
                  />
                  <InputNumber
                    placeholder="Latitude"
                    min={-90}
                    max={90}
                    onChange={(e) =>
                      setAddressConfig({
                        ...addressConfig,
                        coordinates: [e, addressConfig.coordinates[1]],
                      })
                    }
                    value={addressConfig.coordinates[1]}
                  />
                  <InputNumber
                    placeholder="Longitude"
                    min={-180}
                    max={180}
                    onChange={(e) =>
                      setAddressConfig({
                        ...addressConfig,
                        coordinates: [addressConfig.coordinates[0], e],
                      })
                    }
                    value={addressConfig.coordinates[0]}
                  />
                </Space>
                <Button
                  style={{ marginTop: 5 }}
                  icon={<TiArrowBack />}
                  onClick={() => setEnterManualAddress(false)}
                />
              </div>
            ) : coordsConfig.coordinates.length != 0 &&
              coordsConfig.address != "" ? (
              <div>
                {coordsConfig.address}{" "}
                <Button
                  size="small"
                  onClick={() =>
                    setCoorsConfig({ coordinates: [], address: "" })
                  }
                >
                  Change
                </Button>
              </div>
            ) : (
              <Space>
                <Button onClick={() => setOpenMap(true)}>Pick Location</Button>
                <Button onClick={() => setEnterManualAddress(true)}>
                  Enter Manually
                </Button>
              </Space>
            )}
          </Form.Item>
          <Form.Item
            label="Total Spaces"
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
                  value={firstPaymentRule?.split(" ")[2]}
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
          <Form.Item label="Updated Business Permit">
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
