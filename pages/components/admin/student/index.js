import React, { useEffect, useState } from "react";
import { Tag, Table, Typography } from "antd";
import axios from "axios";

import json from "../../../assets/json/constant.json";

const Student = () => {
  const [students, setStudents] = useState([]);

  const column = [
    {
      title: "Name",
      render: (_, row) => row?.firstName + " " + row?.lastName,
      sorter: (a, b) => a.firstName.length - b.firstName.length,
    },
    {
      title: "College",
      sorter: (a, b) => a.college.length - b.college.length,
      render: (_, row) => (
        <Tag
          color={json.colleges.filter((e) => e.value == row?.college)[0]?.color}
        >
          {row?.college?.toUpperCase() ?? "No Data"}
        </Tag>
      ),
    },
    {
      title: "Establishment place",
      sorter: (a, b) =>
        a.tenant?.establishmentId?.name?.length -
        b.tenant?.establishmentId?.name?.length,
      render: (_, row) => row?.tenant?.establishmentId?.name ?? "Not yet",
    },
  ];

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/admin/get-students");

      if (data.status == 200) setStudents(data.students);
    })(axios);
  }, []);
  return (
    <Table
      title={() => (
        <Typography.Text>Masterlist of all students</Typography.Text>
      )}
      columns={column}
      dataSource={students}
    />
  );
};

export default Student;
