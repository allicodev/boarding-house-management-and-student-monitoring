import React, { useEffect, useState } from "react";
import { Tag, Table, Typography, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

import json from "../../../assets/json/constant.json";
import { StudentProfile } from "../../../assets/utilities";
import FilterForm from "./component/FilterForm";

const Student = ({ app_key }) => {
  const [students, setStudents] = useState([]);
  const [openStudent, setOpenStudent] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);

  const column = [
    {
      title: "Name",
      render: (_, row) => row?.firstName + " " + row?.lastName,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Age",
      sorter: (a, b) => a - b,
      render: (_, row) =>
        dayjs().diff(
          dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
          "years",
          false
        ),
    },
    {
      title: "Gender",
      sorter: (a, b) => a?.gender?.length - b?.gender?.length,
      render: (_, row) => {
        if (["male", "female"].includes(row?.gender))
          return (
            <Tag color={row?.gender == "male" ? "blue" : "pink"}>
              {row?.gender}
            </Tag>
          );
        else
          return (
            <Typography.Text type="secondary" italic>
              No Data
            </Typography.Text>
          );
      },
    },
    {
      title: "Year",
      sorter: (a, b) => a?.year - b?.year,
      render: (_, row) => {
        if (row?.year) return row?.year;
        else
          return (
            <Typography.Text type="secondary" italic>
              No Data
            </Typography.Text>
          );
      },
    },
    {
      title: "College",
      sorter: (a, b) => a?.college.localeCompare(b?.college),
      render: (_, row) => (
        <Tag
          color={json.colleges.filter((e) => e.value == row?.college)[0]?.color}
        >
          {row?.college?.toUpperCase() ?? "No Data"}
        </Tag>
      ),
    },
    {
      title: "Course",
      dataIndex: "course",
    },
    {
      title: "Establishment place",
      sorter: (a, b) =>
        a.tenant?.establishmentId?.name?.localeCompare(
          b.tenant?.establishmentId?.name
        ),
      render: (_, row) =>
        row?.tenant?.establishmentId?.name ?? (
          <Typography.Text type="secondary" italic>
            No Data
          </Typography.Text>
        ),
    },
  ];

  // * axios areas

  const fetchStudent = (college, course) => {
    let query = {};
    if (college != "") query.college = college;
    if (course != "") query.course = course;

    (async (_) => {
      let { data } = await _.get("/api/admin/get-students", { params: query });

      if (data.status == 200) setStudents(data.students);
    })(axios);
  };

  useEffect(() => {
    fetchStudent();
  }, [trigger]);

  return (
    <>
      <StudentProfile
        open={openStudent.open}
        close={() => setOpenStudent({ open: false, data: null })}
        data={openStudent.data}
        appkey={app_key}
        refresh={() => setTrigger(trigger + 1)}
      />
      <FilterForm
        open={openFilter}
        close={() => setOpenFilter(false)}
        onFilterSubmit={(college, course) => {
          if (college == "") {
            fetchStudent();
          } else {
            if (course == "") {
              fetchStudent(college);
            } else {
              fetchStudent(college, course);
            }
          }
        }}
        clearFilter={() => fetchStudent()}
      />

      {/* render */}
      <Button
        style={{ float: "right", marginBottom: 5 }}
        onClick={() => setOpenFilter(true)}
      >
        Filter
        <FilterOutlined />
      </Button>
      <Table
        columns={column}
        dataSource={students}
        onRow={(data) => {
          return {
            onClick: () => setOpenStudent({ open: true, data }),
          };
        }}
      />
    </>
  );
};

export default Student;
