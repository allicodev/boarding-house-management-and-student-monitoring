import React, { useState, useEffect } from "react";
import { Card, Col, Row, Space, Statistic, message } from "antd";
import RequestTable from "./component/request_table";
import RecentTable from "./component/recent_table";
import axios from "axios";
import Cookies from "js-cookie";

import { Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const Home = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedTenants, setAcceptedTenants] = useState([]);
  const [totalData, setTotalData] = useState({ vacant: 0, total: 0 });
  const [trigger, setTrigger] = useState(0);
  const [establishments, setEstablishments] = useState([]);
  const [max, setMax] = useState(10);

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/landlord/request-extra-data");
      if (data.status != 200) {
        message.error(data.message);
      } else setTotalData(data.data);
    })(axios);
    (async (_) => {
      let { data } = await _.get("/api/landlord/request-data", {
        params: { type: "request" },
      });

      if (data.status != 200) {
        message.error(data.message);
      } else setRequests(data.data);
    })(axios);
    (async (_) => {
      let { data } = await _.get("/api/landlord/recent-accepted-tenants");
      if (data.status != 200) {
        message.error(data.message);
      } else setAcceptedTenants(data.data);
    })(axios);
    (async (_) => {
      let { data } = await _.get("/api/landlord/get-establishments", {
        params: {
          _id: user?._id,
        },
      });

      if (data.status == 200) {
        setEstablishments(
          data.establishment.map((e) => {
            setMax(Math.ceil(e?.tenants.length / 10) * 10);

            return {
              estabName: e?.name,
              total: e?.tenants.length ?? 0,
            };
          })
        );
      }
    })(axios);
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
      <Col span={24}>
        <Bar
          options={{
            responsive: true,
            animations: {
              y: {
                easing: "easeInOutElastic",
                from: (ctx) => {
                  if (ctx.type === "data") {
                    if (ctx.mode === "default" && !ctx.dropped) {
                      ctx.dropped = true;
                      return 0;
                    }
                  }
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Total Tenants per Establishment",
                position: "top",
                font: {
                  size: "13px",
                  family: "Sans-Serif",
                },
              },
            },
            scales: {
              barThickness: 0.5,
              y: {
                min: 0,
                max,
                stacked: true,
                title: {
                  display: true,
                  text: "Tenants",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Establishments",
                },
              },
            },
          }}
          data={{
            labels: establishments.map((e) => e?.estabName),
            datasets: [
              {
                label: "Tenant(s)",
                data: establishments.map((e) => e?.total),
                backgroundColor: "rgba(0,185,107,0.5)",
                borderColor: "rgba(0,185,107,1)",
                type: "bar",
                barThickness: 30,
                categoryPercentage: 1,
                barPercentage: 1.0,
              },
            ],
          }}
        />
      </Col>
    </Row>
  );
};

export default Home;
