import React, { useEffect, useState } from "react";
import { Alert, Badge, Table, Typography } from "antd";
import StudentProfile from "./student_profile";
import dayjs from "dayjs";

const RequestTable = ({ sourceData, refresh }) => {
  let [_sourceData, setSourceData] = useState([]);
  const [openStudentProfile, setOpenStudentProfile] = useState({
    open: false,
    data: null,
  });
  const [index, setIndex] = useState(-1);

  const columns = [
    {
      title: "Name",
      align: "center",
      render: (_, row) => {
        return (
          <span>
            {row?.studentId?.firstName + " " + row?.studentId?.lastName}{" "}
            {!row?.seen ? (
              <small style={{ color: "#ff0000" }} italic="true">
                New
              </small>
            ) : null}
          </span>
        );
      },
    },
    {
      title: "Accommodation",
      align: "center",
      render: (_, row) => row?.establishmentId.name,
    },
    {
      title: "Date Requested",
      align: "center",
      render: (_, row) => dayjs(row?.createdAt).format("MMMM D, YYYY"),
    },
  ];

  useEffect(() => {
    setSourceData(sourceData);
  }, [sourceData]);

  return (
    <>
      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Badge
              count={sourceData?.filter((e) => !e.seen).length}
              offset={[10, 0]}
              showZero={false}
            >
              <Typography.Text style={{ fontWeight: "bold" }}>
                List of Requests
              </Typography.Text>
            </Badge>
            <Alert
              message="You can open student profile by clicking a row"
              type="warning"
              style={{ width: 350 }}
              closable
            />
          </div>
        )}
        dataSource={_sourceData}
        pagination={false}
        columns={columns}
        rowKey={(_) => _._id}
        style={{ cursor: "pointer" }}
        bordered
        onRow={(row, index) => {
          return {
            onClick: (_) => {
              setOpenStudentProfile({ open: true, data: row });
              setIndex(index);
            },
          };
        }}
      />
      {/* UTILS */}
      <StudentProfile
        open={openStudentProfile.open}
        close={() => setOpenStudentProfile({ open: false, data: null })}
        data={openStudentProfile.data}
        refresh={refresh}
        update={() => {
          setSourceData((e) => {
            if (e[index]) {
              e[index].seen = true;
            }
            return [...e];
          });
        }}
      />
    </>
  );
};
export default RequestTable;
