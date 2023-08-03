import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Table, Tag, Tooltip } from "antd";
import axios from "axios";

import json from "../../../assets/json/constant.json";
import dayjs from "dayjs";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const Tenants = () => {
  const [tenants, setTenants] = useState([]);

  const column = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "College",
      render: (_, row) => (
        <Tooltip
          title={json.colleges.filter((e) => e.value == row?.college)[0]?.label}
        >
          <Tag
            color={
              json.colleges.filter((e) => e.value == row?.college)[0]?.color
            }
          >
            {row?.college?.toUpperCase() ?? "No Data"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Establishment",
      dataIndex: "estabName",
    },
    {
      title: "Date Confirmed",
      dataIndex: "dateConfirmed",
    },
  ];

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/landlord/get-establishments", {
        params: {
          _id: user?._id,
        },
      });

      if (data.status == 200) {
        let _tenants = [];
        data.establishment.map((e) => {
          e.tenants.forEach((__) => {
            let obj = {
              name: __.studentId?.firstName + " " + __.studentId?.lastName,
              college: __.studentId?.college,
              estabName: __.establishmentId?.name,
              dateConfirmed: dayjs(_?.createdAt).format("MMMM DD, YYYY"),
            };

            _tenants.push(obj);
          });
        });

        setTenants(_tenants);
      }
    })(axios);
  }, []);

  return <Table dataSource={tenants} columns={column} />;
};

export default Tenants;
