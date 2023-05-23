import React, { useState } from "react";
import { Alert, Badge, Space, Table, Typography } from "antd";
import StudentProfile from "./student_profile";

const RequestTable = ({ sourceData }) => {
  const [openStudentProfile, setOpenStudentProfile] = useState({
    open: false,
    data: null,
  });
  const columns = [
    {
      title: "id",
      render: (_, row) => (
        <>
          {row._id}{" "}
          {!row?.seen ? (
            <small style={{ color: "#ff0000" }} italic="true">
              New
            </small>
          ) : null}
        </>
      ),
    },
    { title: "Name", align: "center", dataIndex: "requestor_name" },
    { title: "Date Requested", align: "center", dataIndex: "date_requested" },
  ];
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
        dataSource={sourceData}
        pagination={false}
        columns={columns}
        rowKey={(_) => _._id}
        style={{ cursor: "pointer" }}
        bordered
        onRow={(row) => {
          return {
            onClick: () => setOpenStudentProfile({ open: true, data: row }), // click row
          };
        }}
      />
      {/* UTILS */}
      <StudentProfile
        open={openStudentProfile.open}
        close={() => setOpenStudentProfile({ open: false, data: null })}
        data={openStudentProfile.data}
      />
    </>
  );
};
export default RequestTable;
