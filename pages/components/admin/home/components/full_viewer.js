import React from "react";
import { Button, Drawer, Popconfirm, Space } from "antd";
import { EstablishmentInfo } from "../../../../assets/utilities";
import axios from "axios";
import Cookies from "js-cookie";

const user = JSON.parse(Cookies.get("currentUser") ?? "{}");

const FullViewer = ({ data, open, close, verify, decline }) => {
  return (
    <>
      <Drawer
        open={open}
        onClose={close}
        placement="bottom"
        height="100%"
        title={data?.name}
        extra={[
          data?.status == "pending" ? (
            <Space>
              <Popconfirm
                title="Are you sure ?"
                okText="Confirm"
                onConfirm={() => decline(data?._id)}
              >
                <Button type="primary" key="key1" danger>
                  Reject
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure ?"
                okText="Confirm"
                onConfirm={() => verify(data?._id)}
              >
                <Button type="primary" key="key2">
                  Verify
                </Button>
              </Popconfirm>
            </Space>
          ) : data?.status == "approved" ? (
            <Popconfirm
              title="Are you sure ?"
              okText="Confirm"
              onConfirm={() => decline(data?._id)}
            >
              <Button
                style={{
                  backgroundColor: "#FFD580",
                  color: "#fff",
                }}
              >
                Revoke
              </Button>
            </Popconfirm>
          ) : null,
        ]}
      >
        <EstablishmentInfo data={data} />
      </Drawer>
    </>
  );
};

export default FullViewer;
