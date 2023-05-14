import React from "react";
import { Card, Col, Row, Space, Statistic } from "antd";
import { mockData } from "../../../assets/utilities";
import RequestTable from "./component/request_table";
import RecentTable from "./component/recent_table";

const Home = () => {
  const status = "full";
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <RequestTable sourceData={mockData["incoming_request"]} />
      </Col>
      <Col span={8}>
        <RecentTable sourceData={mockData["incoming_request"]} />
      </Col>
      <Col span={4}>
        <Space direction="vertical">
          <Card
            bordered={false}
            style={{
              backgroundColor: status == "full" ? "#ff0000" : "#87d068",
              textAlign: "center",
              color: "#ffffff",
              fontSize: "2em",
              opacity: 0.7,
            }}
          >
            {status == "full" ? "Full" : "Available"}
          </Card>
          <Card bordered={false}>
            <Statistic title="Vacant" value={0} />
          </Card>
          <Card bordered={false}>
            <Statistic title="Total Room Space" value={16} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default Home;
