import { Table, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const RecentTable = ({ sourceData }) => {
  const columns = [
    {
      title: "Name",
      align: "center",
      render: (_, row) =>
        row?.studentId?.firstName + " " + row?.studentId?.lastName,
    },
    {
      title: "Date Accepted",
      align: "center",
      render: (_, row) => dayjs(row?.createdAt).format("MMMM D, YYYY"),
    },
  ];
  return (
    <Table
      title={() => (
        <Typography.Text style={{ fontWeight: "bold" }}>
          List of Recent Accepted Tenants
        </Typography.Text>
      )}
      dataSource={sourceData}
      pagination={false}
      columns={columns}
      rowKey={(_) => _._id}
      bordered
    />
  );
};

export default RecentTable;
