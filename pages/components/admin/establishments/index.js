import React, { useEffect, useState } from "react";
import { Typography, Table, Tag, message, Button, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";

import FullViewer from "./components/full_viewer";
import axios from "axios";
import ReportGenerator from "../../../layout/components/report_generator";
import json from "../../../assets/json/constant.json";
import {
  ArchiveTable,
  LandlordTermsCondition,
} from "../../../assets/utilities";
import EstabFilterForm from "../student/component/FilterForm2";

const Home = ({ app_key }) => {
  const [establishment, setEstablishment] = useState([]);
  const [openViewer, setOpenViewer] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
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
  const [tcConfig, setTcConfig] = useState({
    open: false,
    name: "",
    viewOnly: true,
    dataSignature: "",
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
            Student List
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTcConfig({
                open: true,
                name: row?.ownerId?.firstName + " " + row?.ownerId?.lastName,
                viewOnly: true,
                dataSignature: row?.signature,
              });
            }}
          >
            T & C
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

  const fetchEstablishment = async (status) => {
    let query = {};
    if (status != "") query.status = status;
    return (async (_) => {
      let { data } = await _.get("/api/admin/get-establishments", {
        params: query,
      });
      if (data.status == 200) return data.data;
    })(axios);
  };

  useEffect(() => {
    (async () => {
      let _ = await fetchEstablishment();
      setEstablishment(_);
    })();
  }, [trigger]);

  return (
    <>
      {/* context */}
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
      <LandlordTermsCondition
        {...tcConfig}
        close={() =>
          setTcConfig({
            open: false,
            name: "",
            viewOnly: true,
            dataSignature: "",
          })
        }
      />
      <EstabFilterForm
        open={openFilter}
        close={() => setOpenFilter(false)}
        onFilterSubmit={async (...params) => {
          let _ = await fetchEstablishment(...params);
          setEstablishment(_);
        }}
        clearFilter={async () => {
          let _ = await fetchEstablishment();
          setEstablishment(_);
        }}
      />
      {/* end */}
      <Button
        style={{ float: "right", marginBottom: 5 }}
        onClick={() => setOpenFilter(true)}
      >
        Filter
        <FilterOutlined />
      </Button>
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
