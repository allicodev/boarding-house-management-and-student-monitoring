import React, { useEffect, useState } from "react";
import { Typography, Table, Tag, message } from "antd";

import FullViewer from "./components/full_viewer";
import axios from "axios";

const Home = () => {
  const [establishment, setEstablishment] = useState([]);
  const [openViewer, setOpenViewer] = useState({ open: false, data: null });
  const [trigger, setTrigger] = useState(0);

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

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/student/get-establishments");
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
      />
      <Table
        columns={column}
        dataSource={establishment}
        rowKey={(_) => _._id}
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
