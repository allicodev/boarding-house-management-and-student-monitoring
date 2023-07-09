import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  List,
  Card,
  Typography,
  Image,
  Segmented,
  Carousel,
  Empty,
} from "antd";
import {
  EllipsisOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ListView = ({ source, setOpenFullDetails }) => {
  const columns = [
    {
      title: "id",
      render: (_, row) =>
        (
          <Typography.Link>
            {row?._id.substr(row?._id.length - 6, 6)}
          </Typography.Link>
        ) ?? "No ID",
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
      render: (_, row) =>
        row?.ownerId?.firstName + " " + row?.ownerId?.lastName ??
        "No owner. Its free",
    },
    {
      title: "Status",
      align: "center",
      render: (_, row) =>
        row.status == "verified" ? (
          <Tag color="green">VERIFIED</Tag>
        ) : (
          <Tag color="red">UNVERIFIED</Tag>
        ),
    },
    {
      title: "Rooms Status",
      align: "center",
      render: (_, row) =>
        (
          <Tag color="#87d068">
            {row?.totalOccupied}/{row?.totalSpaceForRent}
          </Tag>
        ) ?? "No Status",
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
      onRow={(data) => {
        return {
          onClick: () => setOpenFullDetails({ open: true, data }),
        };
      }}
      rowKey={(_) => _._id}
    />
  );
};

const GridView = ({ source, setOpenFullDetails }) => {
  const [activeTab, setActiveTab] = useState("p_info");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageType, setImageType] = useState("Photos");

  const content = (tab, el) => {
    switch (tab) {
      case "p_info": {
        let flag = el?.totalOccupied >= el?.totalSpaceForRent;
        let verified = el?.status == "verified";
        return (
          <>
            <Typography.Title level={3}>{el?.name}</Typography.Title>
            <Tag color={verified ? "#98e179" : "#FF0000"}>
              {verified ? <CheckOutlined /> : <CloseOutlined />}
              {verified ? "VERIFIED" : "NOT VERIFIED"}
            </Tag>
            <Tag color={flag ? "#FFD580" : "#87d068"}>
              {flag ? "FULL" : "VACANT"}
            </Tag>
            <br />
            <br />
            <Typography.Text>{el?.address}</Typography.Text> <br /> <br />
            <Typography.Text>
              Occupied:{" "}
              {<Tag color={flag ? "#aaa" : "#108ee9"}>{el?.totalOccupied}</Tag>}
              Total:{" "}
              {
                <Tag color={flag ? "#aaa" : "#108ee9"}>
                  {el?.totalSpaceForRent}
                </Tag>
              }
            </Typography.Text>
          </>
        );
      }
      case "o_info": {
        const owner = el?.ownerId;
        return (
          <>
            {owner?.profilePhoto && (
              <Image src={owner?.profilePhoto} preview={false} width={250} />
            )}
            <Typography.Title level={5}>
              {owner?.firstName + " " + owner?.lastName}
            </Typography.Title>
            <small style={{ color: "#aaa" }}>{owner?.email}</small> <br />
            <small style={{ color: "#aaa" }}>{owner?.phoneNumber}</small>
          </>
        );
      }
      case "i_info": {
        return (
          <>
            {el?.establishmentPhotos?.length == 0 &&
            el?.businessPermitPhoto == null ? (
              <Empty description={false} />
            ) : (
              <>
                <Segmented
                  options={["Photos", "Business Permit"]}
                  onChange={(e) => setImageType(e)}
                  style={{ padding: 5 }}
                />
                <Carousel
                  autoplaySpeed={2000}
                  style={{ width: 250, marginTop: 10 }}
                  autoplay
                >
                  {imageType == "Photos" &&
                    el?.establishmentPhotos.map((_, i) => (
                      <Image src={_} width={250} key={i} />
                    ))}
                  {imageType == "Business Permit" && (
                    <Image src={el?.businessPermitPhoto} width={250} />
                  )}
                </Carousel>
              </>
            )}
          </>
        );
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
