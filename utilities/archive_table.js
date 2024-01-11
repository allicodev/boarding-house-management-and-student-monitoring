import React, { useState } from "react";
import { Modal, Table, Typography } from "antd";
import dayjs from "dayjs";

import { StudentProfile } from ".";

const ArchiveTable = ({ data, open, close, appkey }) => {
  const [openStudentProfile, setOpenStudentProfile] = useState({
    open: false,
    data: null,
  });

  const column = [
    {
      title: "Student",
      render: (_, row) => (
        <Typography.Link
          onClick={() =>
            setOpenStudentProfile({ open: true, data: row?.studentId })
          }
        >
          {row?.studentId?.firstName} {row?.studentId?.lastName}
        </Typography.Link>
      ),
    },
    {
      title: "Added Date",
      render: (_, row) => dayjs(row?.createdAt).format("MMM DD, YYYY"),
    },
  ];
  return (
    <>
      <StudentProfile
        {...openStudentProfile}
        close={() =>
          setOpenStudentProfile({
            open: false,
            data: null,
          })
        }
        appkey={appkey}
        refresh={() => {}}
      />
      <Modal open={open} onCancel={close} footer={null} closable={false}>
        <Table columns={column} dataSource={data} pagination={false} />
      </Modal>
    </>
  );
};

export default ArchiveTable;
