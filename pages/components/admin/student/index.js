import React, { useEffect, useState } from "react";
import { Tag, Table, Typography, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

import json from "../../../assets/json/constant.json";
import { StudentProfile, ListStudentBarangay } from "../../../assets/utilities";
import FilterForm from "./component/FilterForm";

const Student = ({ app_key }) => {
  const [students, setStudents] = useState([]);
  const [openStudent, setOpenStudent] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const [studentListConfig, setStudentListConfig] = useState({
    open: false,
    data: [],
    barangay: "",
  });

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

  const fetchStudent = async (college, course, barangay) => {
    let query = {};
    if (college != "") query.college = college;
    if (course != "") query.course = course;
    if (barangay != "") query.barangay = barangay;
    return (async (_) => {
      let { data } = await _.get("/api/admin/get-students", {
        params: query,
      });

      if (data.status == 200) return data.students;
    })(axios);
  };

  const generateListStudent = async (...params) => {
    const _ = await fetchStudent(...params);
    console.log(_);
    setStudentListConfig({ open: true, data: _, barangay: params[2] });
  };

  useEffect(() => {
    (async () => {
      let _ = await fetchStudent();
      setStudents(_);
    })();
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
        onFilterSubmit={async (...params) => {
          let _ = await fetchStudent(...params);
          setStudents(_);
        }}
        onGenerateList={(...params) => generateListStudent(...params)}
        clearFilter={async () => {
          let _ = await fetchStudent();
          setStudents(_);
        }}
      />
      <ListStudentBarangay
        {...studentListConfig}
        close={() =>
          setStudentListConfig({ open: false, data: [], barangay: "" })
        }
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
