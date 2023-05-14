import React, { useState } from "react";
import { Table, Tag, Button, List, Card, Typography } from "antd";
import {
  EllipsisOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ListView = ({ source, setOpenFullDetails }) => {
  const columns = [
    {
      title: "id",
      render: (_, row) => row?._id.substr(row?._id.length - 6, 6) ?? "No ID",
    },
    {
      title: "Name",
      render: (_, row) => row?.name ?? "No name",
    },
    {
      title: "Address",
      render: (_, row) => row?.address ?? "No Address",
    },
    {
      title: "Owner Name",
      render: (_, row) => row?.ownerName ?? "No owner. Its free",
    },
    {
      title: "Rooms Status",
      align: "center",
      render: (_, row) =>
        (
          <Tag color="#87d068">
            {row?.roomStatus.occupied}/{row?.roomStatus.total}
          </Tag>
        ) ?? "No Status", // occupied rooms or space / total room [red text when full, otherwise green]
    },
    {
      title: "",
      align: "center",
      render: (_, row) => (
        <Button
          type="link"
          onClick={() => setOpenFullDetails({ open: true, data: row })}
        >
          View More
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={false}
      dataSource={source}
      rowKey={(_) => _._id}
    />
  );
};

const GridView = ({ source, setOpenFullDetails }) => {
  const [activeTab, setActiveTab] = useState("p_info");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const content = (tab, el) => {
    switch (tab) {
      case "p_info": {
        let flag = el?.roomStatus.occupied >= el?.roomStatus.total;
        let verified = el?.status == "verified";
        return (
          <>
            <Tag color={verified ? "#98e179" : "#FF0000"}>
              {verified ? <CheckOutlined /> : <CloseOutlined />}
              {verified ? "VERIFIED" : "NOT VERIFIED"}
            </Tag>
            <Tag color={flag ? "#FFD580" : "#87d068"}>
              {flag ? "FULL" : "VACANT"}
            </Tag>
            <Typography.Title level={5}>{el?.name}</Typography.Title>
            <Typography.Text>{el?.address}</Typography.Text> <br />
            <Typography.Text>
              Occupied:{" "}
              {
                <Tag color={flag ? "#aaa" : "#108ee9"}>
                  {el?.roomStatus.occupied}
                </Tag>
              }
              Total:{" "}
              {
                <Tag color={flag ? "#aaa" : "#108ee9"}>
                  {el?.roomStatus.total}
                </Tag>
              }
            </Typography.Text>
          </>
        );
      }
      case "o_info": {
        return "o";
      }
      case "i_info": {
        return "i";
      }
      default:
        return "ERROR";
    }
  };

  return (
    <List
      itemLayout="horizontal"
      grid={{ gutter: 3, column: 4 }}
      dataSource={source}
      renderItem={(el, i) => (
        <List.Item key={i}>
          <Card
            key={i}
            style={{
              width: 300,
            }}
            actions={[
              <EllipsisOutlined
                key="ellipsis"
                onClick={() => setOpenFullDetails({ open: true, data: el })}
              />,
            ]}
            tabList={[
              {
                tab: "Place",
                key: "p_info",
              },
              {
                tab: "Owner Info",
                key: "o_info",
              },
              { tab: "Images", key: "i_info" },
            ]}
            onTabChange={(e) => {
              setActiveTab(e);
              setSelectedIndex(i);
            }}
            hoverable
          >
            {content(i == selectedIndex ? activeTab : "p_info", el)}
          </Card>
        </List.Item>
      )}
    />
  );
};

export { ListView, GridView };
