import React, { useEffect, useState } from "react";
import { Typography, Table, Tag, message, Button, Space } from "antd";

import FullViewer from "./components/full_viewer";
import axios from "axios";
import ReportGenerator from "../../../layout/components/report_generator";
import json from "../../../assets/json/constant.json";
import ArchiveTable from "../../../assets/utilities/archive_table";
const Home = ({ app_key }) => {
  const [establishment, setEstablishment] = useState([]);
  const [openViewer, setOpenViewer] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);
  const [report, setReport] = useState({
    open: false,
    column: [],
    data: [],
    title: "",
  });
  const [openStudentProfile, setOpenStudentProfile] = useState({
    open: false,
    data: null,
  });

  const column = [
    {
      title: "Establishment Name",
      dataIndex: "name",
    },

    {
      title: "Owner",
      render: (_, row) => (
        <Typography.Text onClick={() => {}}>
          {row?.ownerId?.firstName + " " + row?.ownerId?.lastName}
        </Typography.Text>
      ),
    },
    {
      title: "Total Space",
      dataIndex: "totalSpaceForRent",
    },
    {
      title: "Status",
      align: "center",
      render: (_, row) => (
        <Tag
          color={
            row?.verification?.at(-1)?.status == "approved"
              ? "#87d068"
              : row?.verification?.at(-1)?.status == "pending"
              ? "#FFD580"
              : "#F00"
          }
        >
          {row?.verification?.at(-1)?.status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "View Functions",
      align: "center",
      render: (_, row) => (
        <Space>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openReport(row?._id);
            }}
          >
            Report
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (async (_) => {
                let { data } = await _.get("/api/landlord/get-archive", {
                  params: {
                    establishmentId: row._id,
                  },
                });
                if (data.status == 200) {
                  setOpenStudentProfile({
                    open: true,
                    data: data.archiveStudent,
                  });
                }
              })(axios);
            }}
          >
            Archive
          </Button>
        </Space>
      ),
    },
  ];

  const verify = (_id) => {
    (async (_) => {
      let { data } = await _.get("/api/admin/verify-establishment", {
        params: {
          _id,
        },
      });

      if (data.status == 200) {
        message.success(data.message);
        setOpenViewer({ open: false, data: null });
        setTrigger(trigger + 1);
      } else message.error(data.message);
    })(axios);
  };

  const decline = (_id, reason) => {
    (async (_) => {
      let { data } = await _.get("/api/admin/reject-establishment", {
        params: {
          _id,
          reason,
        },
      });

      if (data.status == 200) {
        message.success(data.message);
        setOpenViewer({ open: false, data: null });
        setTrigger(trigger + 1);
      } else message.error(data.message);
    })(axios);
  };

  const openReport = (id) => {
    const columns = [
      {
        title: "ID Number",
        align: "center",
        render: (_, row) => row?.studentId?.idNumber,
      },
      {
        title: "Name",
        align: "center",
        render: (_, row) =>
          row?.studentId?.firstName + " " + row?.studentId?.lastName,
      },
      {
        title: "Email",
        align: "center",
        render: (_, row) => row?.studentId?.email,
      },
      {
        title: "Gender",
        align: "center",
        render: (_, row) => row?.studentId?.gender,
      },
      {
        title: "Year",
        align: "center",
        render: (_, row) => row?.studentId?.year,
      },
      {
        title: "College",
        align: "center",
        render: (_, row) =>
          json.colleges.filter((e) => e.value == row?.studentId?.college)[0]
            ?.label,
      },
      {
        title: "Boarding House",
        align: "center",
        render: (_, row) => row?.establishmentId?.name,
      },
    ];
    (async (_) => {
      let { data } = await _.get("/api/admin/students-by-establishment", {
        params: {
          placeId: id,
        },
      });

      if (data.status == 200) {
        setReport({
          open: true,
          data: data.students,
          title: "Student List",
          column: columns,
        });
      }
    })(axios);
  };

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/admin/get-establishments");
      if (data.status == 200) setEstablishment(data.data);
    })(axios);
  }, [trigger]);

  return (
    <>
      <FullViewer
        open={openViewer.open}
        close={() => setOpenViewer({ open: false, data: null })}
        data={openViewer.data}
        verify={verify}
        decline={decline}
        appkey={app_key}
      />
      <ReportGenerator
        open={report.open}
        columns={report.column}
        data={report.data}
        title={report.title}
        close={() =>
          setReport({
            open: false,
            column: [],
            data: [],
            title: "",
          })
        }
      />
      <ArchiveTable
        {...openStudentProfile}
        close={() => setOpenStudentProfile({ open: false, data: null })}
        appkey={app_key}
      />
      <Table
        columns={column}
        dataSource={establishment}
        rowKey={(_) => _.name}
        onRow={(row, index) => {
          return {
            onClick: (_) => {
              setOpenViewer({ open: true, data: row });
            },
          };
        }}
      />
    </>
  );
};

export default Home;
