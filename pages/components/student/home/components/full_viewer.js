import React from "react";
import { Col, Drawer, Row, Space, Tag } from "antd";

const FullViewer = ({ data, open, close }) => {
  return (
    <Drawer
      open={open}
      onClose={close}
      placement="bottom"
      height="100%"
      title={
        <Space>
          {data?.name}
          {data.status == "verified" ? (
            <Tag color="green">VERIFIED</Tag>
          ) : (
            <Tag color="red">UNVERIFIED</Tag>
          )}
        </Space>
      }
    >
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
          }}
        >
          GOOGLE MAP HERE
        </Col>
        <Col span={10}></Col>
      </Row>
    </Drawer>
  );
};

export default FullViewer;
