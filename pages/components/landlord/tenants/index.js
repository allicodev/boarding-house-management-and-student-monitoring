import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

import json from "../../../assets/json/constant.json";
import { StudentProfile } from "../../../assets/utilities";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [openStudent, setOpenStudent] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);

  const handleArchiveStudent = (__) => {
    (async (_) => {
      let res = await _.delete("/api/landlord/remove-in-establishment", {
        params: {
          studentId: __?.student?._id,
          establishmentId: __?.establishment?.establishmentId?._id,
        },
      });

      if (res.data.status == 200) {
        setTrigger(trigger + 1);
        message.success("Successfully Archived");
      } else message.error(res.data.message ?? "Error in the server");
    })(axios);
  };

  const column = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "College",
      render: (_, row) => (
        <Tooltip
          title={`${
            json.colleges.filter((e) => e.value == row?.college)[0]?.label
          }\n${row?.student?.course ?? ""}`}
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
      title: "Course",
      align: "center",
      render: (_, row) => row?.student?.course,
    },
    {
      title: "Establishment",
      dataIndex: "estabName",
    },
    {
      title: "Date Confirmed",
      dataIndex: "dateConfirmed",
    },
    {
      title: "Functions",
      align: "center",
      render: (_, row) => (
        <Space>
          <Popconfirm
            title="Are you sure ?"
            okText="Confirm"
            onCancel={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onConfirm={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleArchiveStudent(row);
            }}
          >
            <Button
              type="link"
              danger
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Archive
            </Button>
          </Popconfirm>
        </Space>
      ),
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
              student: __.studentId,
              name: __.studentId?.firstName + " " + __.studentId?.lastName,
              college: __.studentId?.college,
              establishment: __,
              estabName: __.establishmentId?.name,
              dateConfirmed: dayjs(__?.createdAt).format("MMMM DD, YYYY"),
            };

            _tenants.push(obj);
          });
        });

        setTenants(_tenants);
      }
    })(axios);
  }, [trigger]);

  return (
    <>
      <StudentProfile
        open={openStudent.open}
        close={() => setOpenStudent({ open: false, data: null })}
        data={openStudent.data}
      />
      <Table
        dataSource={tenants}
        columns={column}
        rowKey={(e) => e._id}
        onRow={(data, i) => {
          return {
            onClick: () => {
              data.student.tenant = data?.establishment;
              setOpenStudent({ open: true, data: data?.student });
            },
          };
        }}
      />
    </>
  );
};

export default Tenants;
