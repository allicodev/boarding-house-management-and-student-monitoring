import React, { useEffect, useState } from "react";
import {
  Result,
  Row,
  Steps,
  Typography,
  Col,
  List,
  Image,
  Button,
  Modal,
  Space,
  Popconfirm,
  message,
} from "antd";
import { LoadingOutlined, SelectOutlined } from "@ant-design/icons";
import { Map, NoImage } from "../../../../assets/utilities";
import dayjs from "dayjs";
import axios from "axios";

const ContentWithSteps = ({ data, close, refresh }) => {
  const [lastStatus, setLastStatus] = useState("");
  const [index, setIndex] = useState(0);
  const [modal, contextHolder] = Modal.useModal(0);
  let _modal = null;

  const confirmDelete = () =>
    (async () => {
      let res = await axios.get("/api/request/delete-request", {
        params: {
          _id: data?._id,
        },
      });

      if (res.data.status == 200) {
        message.success(res.data.message);
        close();
        refresh();
      } else {
        message.error(res.data.message);
        close();
      }
    })();

  const confirmContinue = () =>
    (async () => {
      let res = await axios.post("/api/request/accept-request", {
        _id: data?._id,
        status: "pending",
      });

      if (res.data.status == 200) {
        message.success(res.data.message);
        close();
        refresh();
      } else {
        message.error(res.data.message);
        close();
      }
    })();

  useEffect(() => {
    const _lastStatus = data?.status;
    if (data) setLastStatus(_lastStatus);

    if (_lastStatus == "draft") setIndex(0);
    if (_lastStatus == "pending") setIndex(1);
    if (_lastStatus == "rejected" || _lastStatus == "accepted") setIndex(2);
  }, [data]);

  return (
    <>
      <Steps
        current={index}
        items={[
          {
            title: "Draft",
            description: "Confirm your request",
          },
          {
            title: "Pending",
            description:
              "Please wait for the landlady/landlord to confirm your request",
            icon: index == 1 ? <LoadingOutlined /> : null,
          },
          {
            title: "Status",
          },
        ]}
      />
      {index == 0 && (
        <>
          <Row>
            <Col span={9} style={{ marginLeft: 20 }}>
              <Typography style={{ fontSize: "2em" }}>
                {data?.establishmentId?.name}
              </Typography>
              <Typography>
                ADDRESS: {data?.establishmentId?.address}{" "}
                <Button
                  style={{ marginLeft: 10 }}
                  icon={<SelectOutlined />}
                  onClick={() => {
                    _modal = modal.info({
                      icon: null,
                      centered: true,
                      maskClosable: true,
                      width: 750,
                      footer: null,
                      title: data?.establishmentId?.address,
                      content: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "80vh",
                            width: 700,
                            background: "#aaa",
                            borderRadius: 10,
                            color: "#ececec",
                            margin: 0,
                          }}
                        >
                          <Map
                            coordinates={{
                              lat: data?.establishmentId?.coordinates[0],
                              lng: data?.establishmentId?.coordinates[1],
                            }}
                          />
                        </div>
                      ),
                    });
                  }}
                >
                  Open Map
                </Button>
              </Typography>

              <Typography>
                Registered on:{" "}
                {dayjs(data?.establishmentId?.createdAt).format("MMMM D, YYYY")}
              </Typography>
              <br />
              <Typography>
                Owner:
                <div style={{ marginLeft: 20 }}>
                  <strong>
                    {data?.establishmentId?.ownerId?.firstName}{" "}
                    {data?.establishmentId?.ownerId?.lastName}
                  </strong>
                  <br />
                  <strong>{data?.establishmentId?.ownerId?.email}</strong>
                  <br />
                  <strong>{`+63${data?.establishmentId?.ownerId?.phoneNumber}`}</strong>
                </div>
              </Typography>
              <br />
              <br />
              <Typography.Title level={4}>
                Establishment Photos
              </Typography.Title>
              <List
                itemLayout="horizontal"
                grid={{ gutter: 3, column: 4 }}
                dataSource={data?.establishmentId?.establishmentPhotos}
                renderItem={(el, i) => (
                  <List.Item key={i}>
                    <Image src={el} alt={`image ${i}`} />
                  </List.Item>
                )}
              />
              <Typography.Title level={4}>
                Business Permit Photos
              </Typography.Title>
              {data?.establishmentId?.businessPermitPhoto ? (
                <Image
                  src={data?.establishmentId?.businessPermitPhoto}
                  alt="business permit photo"
                />
              ) : (
                <NoImage />
              )}
            </Col>
            <Col
              span={14}
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "flex-end",
              }}
            >
              <Space>
                <Popconfirm
                  title="Delete the request"
                  description="Are you sure to delete this request?"
                  onConfirm={confirmDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
                <Popconfirm
                  title="Confirm Request"
                  description="Are you sure to continue this request?"
                  onConfirm={confirmContinue}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Proceed and Confirm</Button>
                </Popconfirm>
              </Space>
            </Col>
          </Row>
          {contextHolder}
        </>
      )}
      {index == 2 && (
        <Result
          status={lastStatus == "accepted" ? "success" : "error"}
          title={
            lastStatus == "accepted"
              ? "Your request has been accepted"
              : "Your request has been declined"
          }
        >
          {lastStatus == "rejected" && (
            <div className="desc">
              <Typography.Paragraph>
                <Typography.Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  The Landlord/Landlady rejected your request with a reason:
                </Typography.Text>
              </Typography.Paragraph>
              <Typography.Paragraph>{data?.declineReason}</Typography.Paragraph>
            </div>
          )}
        </Result>
      )}
    </>
  );
};

export default ContentWithSteps;
