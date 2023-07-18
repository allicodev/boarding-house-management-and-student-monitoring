import React, { useEffect, useState } from "react";
import {
  Tabs,
  Button,
  message,
  Typography,
  Carousel,
  Image,
  Card,
  Statistic,
  Space,
  Segmented,
  Spin,
  Modal,
  Tag,
  Tooltip,
} from "antd";
import NewEstablishment from "./components/new_establishment";
import axios from "axios";
import Cookies from "js-cookie";
import ModalTable from "./components/modal_table";
import NoImage from "../../../assets/utilities/no_image";

const Establishment = () => {
  const [openNewEstablishment, setOpenNewEstablishment] = useState(false);
  const [establishment, setEstablishment] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [openTable, setOpenTable] = useState({ open: false, data: null });
  const [loader, setLoader] = useState("");
  const [openedTab, setOpenedTab] = useState("Info");

  const fetchData = async (type) => {
    let { data } = await axios.get(`/api/landlord/request-data`, {
      params: { type },
    });

    if (data.status != 200) {
      message.error(data.message);
      return;
    } else {
      if (data.data.length > 0) {
        setOpenTable({ open: true, data: data.data });
        message.success(data.message);
      } else message.warning("Empty");
    }
  };

  // const handleDeleteEstablishment = async (id) => {
  //   let { data } = await axios.get(`/api/landlord/delete-establishment`, {
  //     params: { id },
  //   });

  //   if (data.status != 200) {
  //     message.error(data.message);
  //     return;
  //   } else {
  //     message.success(data.message);
  //   }
  // };

  const updatedTabData = (estab) => {
    return estab.map((e, i) => {
      return {
        label: e?.name,
        children: (
          <>
            <Segmented
              options={["Info", "Images"]}
              style={{ padding: 5 }}
              onChange={(e) => setOpenedTab(e)}
            />
            {openedTab == "Info" && (
              <>
                <div style={{ display: "flex" }}>
                  <Typography.Title level={2} style={{ marginBottom: 1 }}>
                    {e?.name}
                  </Typography.Title>

                  <Tag
                    color={e?.status == "verified" ? "#87d068" : "#ff0000"}
                    style={{ marginLeft: 10, marginBottom: 15 }}
                  >
                    {e?.status == "verified" ? (
                      <>VERIFIED</>
                    ) : (
                      <Tooltip title="Verification is still on process">
                        NOT VERIFIED
                      </Tooltip>
                    )}
                  </Tag>
                </div>

                <Typography.Text type="secondary">{e?.address}</Typography.Text>
                <br />
                <Space>
                  <Card onClick={() => fetchData("request")} hoverable>
                    <Statistic
                      title="Request"
                      value={e?.totalRequests > 99 ? "99+" : e?.totalRequests}
                    />
                  </Card>
                  <Card onClick={() => fetchData("tenants")} hoverable>
                    <Statistic title="Tenants" value={e?.totalSpaceRented} />
                  </Card>
                  <Card hoverable>
                    <Statistic
                      title="Rooms"
                      value={`${e?.totalSpaceRented} / ${e?.totalSpaceForRent}`}
                    />
                  </Card>
                </Space>
              </>
            )}
            {openedTab == "Images" && (
              <>
                <Typography.Title level={5}>
                  Establishment Photos
                </Typography.Title>{" "}
                <Carousel
                  autoplaySpeed={2000}
                  style={{ width: 500, marginTop: 10 }}
                  autoplay
                >
                  {e?.establishmentPhotos?.length > 0 ? (
                    e?.establishmentPhotos.map((_, i) => (
                      <Image src={_} width={500} key={i} alt="image1" />
                    ))
                  ) : (
                    <NoImage />
                  )}
                </Carousel>
                <br />
                <Typography.Title level={5}>Business permit</Typography.Title>
                {e?.businessPermitPhoto != null ? (
                  <Image
                    src={e?.businessPermitPhoto}
                    width={500}
                    alt="image2"
                  />
                ) : (
                  <NoImage />
                )}
              </>
            )}
          </>

          //   {(e?.establishmentPhotos?.length > 0 ||
          //     e?.businessPermitPhoto != undefined) && (
          //     <Col span={10}>
          //       <Segmented
          //         options={["Establishment Photos", "Business Permit"]}
          //         style={{ padding: 5 }}
          //         onChange={(e) => setImageType(e)}
          //       />

          //     </Col>
          //   )}

          //   <FloatButton.Group
          //     tooltip={<div>SETTINGS</div>}
          //     icon={<SettingOutlined />}
          //     type="primary"
          //     trigger="click"
          //     style={{
          //       right: 50,
          //     }}
          //   >
          //     <Tooltip title="Delete establishment">
          //       <Button
          //         icon={<DeleteOutlined />}
          //         onClick={() =>
          //           modal.confirm({
          //             title: "Are you sure you want to delete ?",
          //             content: (
          //               <Typography.Text type="secondary">
          //                 Click "confirm" to remove {estab[i].name}.
          //               </Typography.Text>
          //             ),
          //             okText: "Confirm",
          //             onOk: () => handleDeleteEstablishment(estab[i]._id),
          //           })
          //         }
          //         danger
          //       />
          //     </Tooltip>
          //   </FloatButton.Group>
        ),
        key: i,
        closable: false,
      };
    });
  };

  useEffect(() => {
    (async () => {
      setLoader("init");
      let { data } = await axios.get("/api/landlord/get-establishments", {
        params: {
          _id: JSON.parse(Cookies.get("currentUser"))._id,
        },
      });

      if (data.status == 200) setEstablishment(data.establishment);
      else message.error(data.message);
      setLoader("");
    })();
  }, [trigger]);

  return (
    <Spin spinning={loader == "init"}>
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
      <ModalTable
        open={openTable.open}
        close={() => setOpenTable({ open: false, data: null })}
        data={openTable.data}
        refresh={() => setTrigger(trigger + 1)}
      />
    </Spin>
  );
};

export default Establishment;
