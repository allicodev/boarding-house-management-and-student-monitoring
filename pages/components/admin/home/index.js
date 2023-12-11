import React, { useEffect, useState } from "react";
import { Row, Col, Space, Segmented, Button } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import json from "../../../assets/json/constant.json";
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

import DashboardCard from "./components/card";
import axios from "axios";

const Home = ({ setSelectedKey }) => {
  const [mode, setMode] = useState("Bar Graph");
  const [cardData, setCardData] = useState({
    totalEstablishmentUnverified: 0,
    totalEstablishmentVerified: 0,
    totalLandlord: 0,
    totalStudent: 0,
  });
  const [openCollege, setOpenCollege] = useState({
    open: false,
    college: {},
  });

  const [barData, setBarData] = useState({
    CON: 0,
    CAS: 0,
    COT: 0,
    COB: 0,
    COE: 0,
    COL: 0,
    COA: 0,
  });

  useEffect(() => {
    (async (_) => {
      setBarData({
        CON: 0,
        CAS: 0,
        COT: 0,
        COB: 0,
        COE: 0,
        COL: 0,
        COA: 0,
      });
      let { data } = await _.get("/api/admin/get-students");

      if (data.status == 200) {
        data?.students.forEach((e) => barData[e?.college?.toUpperCase()]++);
        setBarData(barData);
      }
    })(axios);

    (async (_) => {
      let { data } = await _.get("/api/admin/dashboard-data");

      if (data.status == 200) {
        setCardData(data.data);
      }
    })(axios);
  }, []);

  return openCollege.open ? (
    <>
      <Button
        style={{ marginLeft: 25, marginRight: 10 }}
        onClick={() => setOpenCollege({ open: false, college: {} })}
      >
        BACK
      </Button>

      {openCollege.college.label}
      {/* <Bar
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
              text: "Students per Course",
              position: "top",
              font: {
                size: "13px",
                family: "Sans-Serif",
              },
            },
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              stacked: true,
              title: {
                display: true,
                text: "Student(s)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Courses",
              },
            },
          },
        }}
        data={{
          datasets: [
            {
              label: "Student(s)",
              data: barData,
              backgroundColor: json.colleges.map((e) => e?.color),
              type: "bar",
            },
          ],
        }}
      /> */}
    </>
  ) : (
    <Row gutter={[16, 16]}>
      <Col span={18}>
        <Segmented
          options={["Bar Graph", "Pie Graph"]}
          value={mode}
          onChange={(e) => setMode(e)}
          style={{ padding: 5 }}
        />
        {mode == "Bar Graph" ? (
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
                  text: "Students per College",
                  position: "top",
                  font: {
                    size: "13px",
                    family: "Sans-Serif",
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 10,
                  stacked: true,
                  title: {
                    display: true,
                    text: "Student(s)",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Colleges",
                  },
                },
              },
              events: ["click"],
              // onClick: (ev, el) => {
              //   console.log(el);
              //   if (
              //     el &&
              //     el.length > 0 &&
              //     el[0] &&
              //     el[0].datasetIndex !== undefined &&
              //     el[0].index !== undefined
              //   ) {
              //     console.log(el[0]._datasetIndex);
              //     console.log("proceed");
              //     const index = el[0].index;
              //     setOpenCollege({
              //       open: true,
              //       college: json.colleges[index],
              //     });
              //   }
              // },
            }}
            data={{
              datasets: [
                {
                  label: "Student(s)",
                  data: barData,
                  backgroundColor: json.colleges.map((e) => e?.color),
                  type: "bar",
                },
              ],
            }}
          />
        ) : null}
        {mode == "Pie Graph" ? (
          <div style={{ width: 500 }}>
            <Pie
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Students per College Pie Chart",
                  },
                },
              }}
              data={{
                labels: json.colleges.map((e) => e.label.split(" ")[0]),
                datasets: [
                  {
                    label: "Student(s)",
                    data: Object.values(barData),
                    backgroundColor: json.colleges.map((e) => e?.color),
                  },
                ],
              }}
            />
          </div>
        ) : null}
      </Col>
      <Col span={6}>
        <Space direction="vertical" style={{ marginTop: 20 }}>
          {[
            {
              label: "pending establishment",
              value: cardData.totalEstablishmentUnverified,
              color: "#ffff00",
            },
            {
              label: "Total Verified Establishment",
              value: cardData.totalEstablishmentVerified,
              color: "#ff0000",
            },
            {
              label: "Total Student",
              value: cardData.totalStudent,
              color: "#00ff00",
            },
            {
              label: "Total Landlord/Landlady registered",
              value: cardData.totalLandlord,
              color: "#0000ff",
            },
          ].map((e, i) => (
            <DashboardCard
              {...e}
              index={i}
              key={i}
              onClick={(index) => {
                if ([0, 1, 3].includes(index)) setSelectedKey("establishments");
                else setSelectedKey("student");
              }}
            />
          ))}
        </Space>
      </Col>
    </Row>
  );
};

export default Home;
