import React, { useEffect, useState } from "react";
import {
  Tabs,
  Button,
  message,
  Typography,
  Carousel,
  Image,
  Row,
  Col,
  Card,
  Statistic,
  Space,
  FloatButton,
  Segmented,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import NewEstablishment from "./components/new_establishment";
import axios from "axios";
import Cookies from "js-cookie";

const Establishment = () => {
  const [openNewEstablishment, setOpenNewEstablishment] = useState(false);
  const [establishment, setEstablishment] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [imageType, setImageType] = useState("Establishment Photos");

  const updatedTabData = (estab) => {
    return estab.map((e, i) => {
      return {
        label: e?.name,
        children: (
          <Row gutter={[16, 16]}>
            {(e?.establishmentPhotos?.length > 0 ||
              e?.businessPermitPhoto != undefined) && (
              <Col span={10}>
                <Segmented
                  options={["Establishment Photos", "Business Permit"]}
                  style={{ padding: 5 }}
                  onChange={(e) => setImageType(e)}
                />
                <Carousel
                  autoplaySpeed={2000}
                  style={{ width: 500, marginTop: 10 }}
                  autoplay
                >
                  {imageType == "Establishment Photos" &&
                    e?.establishmentPhotos.map((_, i) => (
                      <Image src={_} width={500} key={i} />
                    ))}
                  {imageType == "Business Permit" && (
                    <Image src={e?.businessPermitPhoto} width={500} />
                  )}
                </Carousel>
              </Col>
            )}

            <Col span={14}>
              <Typography.Title level={2} style={{ marginBottom: 1 }}>
                {e?.name}
              </Typography.Title>
              <Typography.Text type="secondary">{e?.address}</Typography.Text>
              <br />
              <Space>
                <Card hoverable>
                  <Statistic title="Request" value="99+" />
                </Card>
                <Card hoverable>
                  <Statistic title="Tenants" value="99+" />
                </Card>
                <Card hoverable>
                  <Statistic title="Rooms" value="16 / 32" />
                </Card>
              </Space>
            </Col>
            <FloatButton
              tooltip={<div>SETTINGS</div>}
              icon={<SettingOutlined />}
              type="primary"
            />
          </Row>
        ),
        key: i,
        closable: false,
      };
    });
  };

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/landlord/get-establishments", {
        params: {
          _id: JSON.parse(Cookies.get("currentUser"))._id,
        },
      });

      if (data.status == 200) setEstablishment(data.establishment);
      else message.error(data.message);
    })();
  }, [trigger]);

  return (
    <>
      {establishment.length > 0 && (
        <Tabs
          type="editable-card"
          items={updatedTabData(establishment)}
          tabBarStyle={{ borderBottom: "1px solid #cecece" }}
          onEdit={(targetKey, action) =>
            setOpenNewEstablishment(action == "add")
          }
        />
      )}
      {establishment.length == 0 && (
        <Button type="primary" onClick={() => setOpenNewEstablishment(true)}>
          New Establishment
        </Button>
      )}
      {/* UTILS */}
      <NewEstablishment
        open={openNewEstablishment}
        close={() => setOpenNewEstablishment(false)}
        refresh={() => setTrigger(trigger + 1)}
      />
    </>
  );
};

export default Establishment;