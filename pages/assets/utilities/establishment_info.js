import { Col, Image, List, Row, Space, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Map, RoundedContainer, IconText } from "./";
import { MdMyLocation } from "react-icons/md";
import { FaLocationPin, FaUser } from "react-icons/fa6";
import { LuPackageCheck } from "react-icons/lu";
import { TbHomeQuestion, TbHomeExclamation } from "react-icons/tb";
import { BsImages } from "react-icons/bs";

const EstablishmentInfo = ({ data }) => {
  let [isFull, setIsFull] = useState(false);

  useEffect(() => {
    setIsFull(data?.totalSpaceForRent - data?.totalOccupied <= 0);
  }, [data]);
  return (
    <Row>
      <Col span={9} style={{ marginLeft: 20 }}>
        <RoundedContainer>
          <Typography style={{ fontSize: "2em" }}>{data?.name}</Typography>
          <Space>
            {data?.verification?.at(-1).status == "approved" ? (
              <Tag color="#87d068">VERIFIED</Tag>
            ) : (
              <Tag color="red">UNVERIFIED</Tag>
            )}
            <Tag color="blue">
              Occupancy ({<span>{data?.totalOccupied}</span>}/
              {data?.totalSpaceForRent})
            </Tag>
            <Tag color="blue">{data?.firstPaymentRule}</Tag>
          </Space>
          <br />
          <br />
          <IconText icon={<FaLocationPin />} text={data?.address} />
          <Typography>
            Registered on {dayjs(data?.createdAt).format("MMMM D, YYYY")}
          </Typography>
        </RoundedContainer>
        <RoundedContainer
          title={
            <IconText
              icon={<TbHomeQuestion size={20} />}
              text="Establishment Type"
              fontSize={20}
            />
          }
        >
          <Space>
            {data?.type?.map((e) => (
              <Tag key={e} color="blue">
                {e}
              </Tag>
            ))}
          </Space>
        </RoundedContainer>
        <RoundedContainer
          title={
            <IconText
              icon={<LuPackageCheck size={20} />}
              text="Package Inclusions"
              fontSize={20}
            />
          }
        >
          {data?.inclusions?.map((e) => (
            <Tag key={e} style={{ margin: 3 }}>
              {e}
            </Tag>
          ))}
        </RoundedContainer>
        <RoundedContainer
          title={
            <IconText
              icon={<TbHomeExclamation size={20} />}
              text="Restrictions"
              fontSize={20}
            />
          }
        >
          <ul style={{ marginLeft: 20 }}>
            {data?.restrictions?.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </RoundedContainer>
        <RoundedContainer
          title={
            <IconText
              icon={<FaUser size={20} />}
              text="Owner's Info"
              fontSize={20}
            />
          }
        >
          <Typography>
            <strong>
              {data?.ownerId?.firstName} {data?.ownerId?.lastName}
            </strong>
            <br />
            <strong>{data?.ownerId?.email}</strong>
            <br />
            <strong>{`+63${data?.ownerId?.phoneNumber}`}</strong>
          </Typography>
        </RoundedContainer>
      </Col>
      <Col
        span={14}
        // style={{
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   minHeight: "80vh",
        //   background: "#aaa",
        //   borderRadius: 10,
        //   color: "#ececec",
        //   margin: 0,
        // }}
      >
        <RoundedContainer
          title={
            <IconText
              icon={<MdMyLocation size={20} />}
              text="Map"
              fontSize={20}
            />
          }
        >
          {data?.coordinates != null && data?.coordinates?.length > 0 ? (
            <Map
              coordinates={{
                lat: data?.coordinates[0],
                lng: data?.coordinates[1],
              }}
              styles={{
                maxHeight: 500,
              }}
            />
          ) : (
            <Typography.Text type="secondary" italic>
              Owner did not set the coordinates/location
            </Typography.Text>
          )}
        </RoundedContainer>
        {data?.establishmentPhotos?.length > 0 && (
          <RoundedContainer
            title={
              <IconText
                icon={<BsImages size={20} />}
                text="Establishment Photos"
                fontSize={20}
              />
            }
            bodyStyle={{ overflow: "scroll" }}
          >
            <List
              itemLayout="horizontal"
              grid={{ gutter: 3, column: 4 }}
              dataSource={data?.establishmentPhotos}
              renderItem={(el, i) => (
                <List.Item key={i}>
                  <Image src={el} alt={`image ${i}`} />
                </List.Item>
              )}
            />
          </RoundedContainer>
        )}
      </Col>
    </Row>
  );
};

export default EstablishmentInfo;
