import React, { useState, useEffect } from "react";
import { Card, Col, Row, Space, Statistic, message } from "antd";
import RequestTable from "./component/request_table";
import RecentTable from "./component/recent_table";
import axios from "axios";

const Home = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedTenants, setAcceptedTenants] = useState([]);
  const [totalData, setTotalData] = useState({ vacant: 0, total: 0 });
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/landlord/request-extra-data");
      if (data.status != 200) {
        message.error(data.message);
      } else setTotalData(data.data);
    })();
    (async () => {
      let { data } = await axios.get("/api/landlord/request-data", {
        params: { type: "request" },
      });

      if (data.status != 200) {
        message.error(data.message);
      } else setRequests(data.data);
    })();
    (async () => {
      let { data } = await axios.get("/api/landlord/recent-accepted-tenants");
      if (data.status != 200) {
        message.error(data.message);
      } else setAcceptedTenants(data.data);
    })();
  }, [trigger]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <RequestTable
          sourceData={requests}
          refresh={() => setTrigger(trigger + 1)}
        />
      </Col>
      <Col span={8}>
        <RecentTable sourceData={acceptedTenants} />
      </Col>
      <Col span={4}>
        <Space direction="vertical">
          <Card
            bordered={false}
            style={{
              backgroundColor: totalData.vacant <= 0 ? "#ff0000" : "#87d068",
              textAlign: "center",
              color: "#ffffff",
              fontSize: "2em",
              opacity: 0.7,
            }}
          >
            {totalData.vacant <= 0 ? "Full" : "Available"}
          </Card>
          <Card bordered={false}>
            <Statistic title="Vacant" value={totalData.vacant} />
          </Card>
          <Card bordered={false}>
            <Statistic title="Total Room Space" value={totalData.total} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default Home;
