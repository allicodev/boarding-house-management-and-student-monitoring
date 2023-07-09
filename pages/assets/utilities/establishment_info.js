import { Col, Image, List, Row, Space, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { NoImage, Map } from "./";

const EstablishmentInfo = ({ data }) => {
  let [isFull, setIsFull] = useState(false);

  useEffect(() => {
    setIsFull(data?.totalSpaceForRent - data?.totalOccupied <= 0);
  }, [data]);
  return (
    <Row>
      <Col
        span={14}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          background: "#aaa",
          borderRadius: 10,
          color: "#ececec",
          margin: 0,
        }}
      >
        {data?.coordinates != null && data?.coordinates?.length > 0 ? (
          <Map
            coordinates={{
              lat: data?.coordinates[0],
              lng: data?.coordinates[1],
            }}
          />
        ) : (
          <Typography.Text type="secondary" italic>
            Owner didn't set the coordinates/location
          </Typography.Text>
        )}
      </Col>
      <Col span={9} style={{ marginLeft: 20 }}>
        <Typography style={{ fontSize: "2em" }}>{data?.name}</Typography>
        <Space>
          <div>
            <Tag color={isFull ? "red" : "success"}>
              {data?.totalSpaceForRent - data?.totalOccupied}
            </Tag>
            Space available
          </div>
          <div>
            {data.status == "verified" ? (
              <Tag color="green">VERIFIED</Tag>
            ) : (
              <Tag color="red">UNVERIFIED</Tag>
            )}
          </div>
        </Space>
        <br />
        <br />
        <Typography>ADDRESS: {data?.address}</Typography>
        <Typography>
          Registered on: {dayjs(data?.createdAt).format("MMMM D, YYYY")}
        </Typography>
        <br />
        <Typography>
          Owner:
          <div style={{ marginLeft: 20 }}>
            <strong>
              {data?.ownerId?.firstName} {data?.ownerId?.lastName}
            </strong>
            <br />
            <strong>{data?.ownerId?.email}</strong>
            <br />
            <strong>{`+63${data?.ownerId?.phoneNumber}`}</strong>
          </div>
        </Typography>
        <br />

        <br />
        <br />
        <Typography.Title level={4}>Establishment Photos</Typography.Title>
        <List
          itemLayout="horizontal"
          grid={{ gutter: 3, column: 4 }}
          dataSource={data?.establishmentPhotos}
          renderItem={(el, i) => (
            <List.Item key={i}>
              <Image src={el} alt={`image ${i}`} />
            </List.Item>
          )}
        />
        <Typography.Title level={4}>Business Permit Photos</Typography.Title>
        {data?.businessPermitPhoto ? (
          <Image src={data?.businessPermitPhoto} alt="business permit photo" />
        ) : (
          <NoImage />
        )}
      </Col>
    </Row>
  );
};

export default EstablishmentInfo;
