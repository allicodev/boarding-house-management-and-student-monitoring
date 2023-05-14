import { Table, Typography } from "antd";
import React from "react";

const RecentTable = ({ sourceData }) => {
  const columns = [
    { title: "Name", align: "center", dataIndex: "requestor_name" },
    { title: "Date Accepted", align: "center", dataIndex: "date_requested" },
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
