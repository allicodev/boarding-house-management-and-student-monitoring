import React, { useState } from "react";
import { Modal, Table, Tooltip, Tag, Typography } from "antd";
import dayjs from "dayjs";

import json from "../pages/assets/json/constant.json";

const ListStudentBarangay = ({ open, close, data }) => {
  const columns = [
    { title: "Name", render: (_, row) => row?.firstName + " " + row?.lastName },
    {
      title: "Establishment",
      render: (_, row) =>
        row?.tenant?.establishmentId?.name ?? (
          <Typography.Text type="secondary" italic>
            No data
          </Typography.Text>
        ),
    },
    {
      title: "College",
      render: (_, row) => (
        <Tooltip
          title={`${
            json.colleges.filter((e) => e.value == row?.college)[0]?.label
          }\n${row?.course ?? ""}`}
        >
          <Tag
            color={
              json.colleges.filter((e) => e.value == row?.college)[0]?.color
            }
            style={{ marginTop: 5 }}
          >
            {row.college?.toUpperCase()} <br />
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Course",
      render: (_, row) => row?.course,
    },
    {
      title: "Age",
      render: (_, row) =>
        dayjs().diff(
          dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
          "years",
          false
        ),
    },
    {
      title: "Year",
      render: (_, row) => row?.year,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      width="90%"
      bodyStyle={{
        height: 500,
        overflow: "scroll",
      }}
      zIndex={999}
      footer={null}
    >
      <Table dataSource={data} columns={columns} pagination={false} />
    </Modal>
  );
};

export default ListStudentBarangay;
