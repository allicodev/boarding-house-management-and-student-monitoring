import React, { useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  Popconfirm,
  Tag,
  Space,
  Typography,
  Row,
  Image,
} from "antd";
import { FaLocationPin, FaUser } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import dayjs from "dayjs";

// import { EditEstablishmentInfo } from "../../../../assets/utilities";
import {
  IconText,
  RoundedContainer,
  Map,
  AdminEstabVerifyTermsCondition,
} from "../../../../assets/utilities";
import VerificationHistory from "../../../landlord/establishment/components/verification_history";
import ReportGenerator from "../../../../layout/components/report_generator";

const FullViewer = ({ data, open, close, verify, decline, appkey }) => {
  const [openDeclineForm, setOpenDeclineForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [reason, setReason] = useState("");
  const [openVerificationHistory, setOpenVerificationHistory] = useState({
    open: false,
    data: null,
  });
  const [fullMapConfig, setFullMapConfig] = useState({
    open: false,
    coordinates: [0, 0],
  });

  const [openTermsCondition, setOpenTermsCondition] = useState(false);
  // const [openEditEstablishment, setOpenEstablishment] = useState({
  //   open: false,
  //   data: null,
  // });

  // const isFull = data?.totalSpaceForRent - data?.totalOccupied <= 0;
  return (
    <>
      {/* UTILS */}
      <ReportGenerator
        columns={[
          {
            title: "Name",
            render: (_, row) => row?.firstName + " " + row?.lastName,
          },
          {
            title: "Establishment",
            render: () => data?.name,
          },
          {
            title: "College",
            align: "center",
            render: (_, row) => row.college?.toUpperCase(),
          },
          {
            title: "Course",
            align: "center",
            render: (_, row) => row?.course,
          },
          ,
          {
            title: "Year",
            align: "center",
            render: (_, row) => row?.year,
          },
          {
            title: "gender",
            align: "center",
            dataIndex: "gender",
          },
          {
            title: "Age",
            align: "center",
            render: (_, row) =>
              dayjs().diff(
                dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
                "years",
                false
              ),
          },
        ]}
        data={data?.tenants?.map((e) => e?.student) ?? []}
        open={showList}
        close={() => setShowList(false)}
        title="List of Students"
      />
      <AdminEstabVerifyTermsCondition
        open={openTermsCondition}
        close={() => setOpenTermsCondition(false)}
        onProceed={() => {
          verify(data?._id);
          setOpenTermsCondition(false);
        }}
      />
      <Modal
        open={fullMapConfig.open}
        onCancel={() => setFullMapConfig({ open: false, coordinates: [0, 0] })}
        width="70%"
        bodyStyle={{
          height: "100%",
        }}
        className="remove-padding-modal"
        zIndex={999}
        closable={false}
        footer={null}
      >
        <Map coordinates={fullMapConfig.coordinates} styles={{ height: 500 }} />
      </Modal>
      <VerificationHistory
        open={openVerificationHistory.open}
        close={() => setOpenVerificationHistory({ open: false, data: null })}
        data={openVerificationHistory.data}
      />
      {/* <EditEstablishmentInfo
        open={openEditEstablishment.open}
        data={openEditEstablishment.data}
        close={() => setOpenEstablishment({ open: false, data: null })}
        appkey={appkey}
      /> */}
      <Modal
        open={openDeclineForm}
        onCancel={() => setOpenDeclineForm(false)}
        footer={null}
        closable={false}
        title="Decline Form"
        bodyStyle={{ display: "flex", flexDirection: "column" }}
      >
        <Typography.Text>Reason: </Typography.Text>
        <Input.TextArea
          onChange={(e) => setReason(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <br />
        <Button
          type="primary"
          style={{ alignSelf: "self-end" }}
          onClick={() => {
            decline(data?._id, reason);
            setOpenDeclineForm(false);
          }}
        >
          SUBMIT
        </Button>
      </Modal>
      {/* END OF UTILS */}
      <Drawer
        open={open}
        onClose={close}
        placement="bottom"
        height="100%"
        title={data?.name}
        bodyStyle={{
          backgroundColor: "#FFD580",
        }}
        zIndex={1}
        extra={[
          // <Button
          //   key="key0"
          //   style={{ marginRight: 5 }}
          //   onClick={() => setOpenEstablishment({ open: true, data })}
          // >
          //   Edit
          // </Button>,
          <Button
            key="key0"
            style={{ marginRight: 5 }}
            onClick={() => setShowList(true)}
          >
            List of Tenants
          </Button>,
          data?.verification?.at(-1).status == "pending" ? (
            <Space key="space-key">
              <Button
                type="primary"
                key="key1"
                onClick={() => setOpenDeclineForm(true)}
                danger
              >
                Reject
              </Button>

              {/* <Popconfirm
                title="Are you sure ?"
                okText="Confirm"
                onConfirm={() => verify(data?._id)}
              > */}
              <Button
                type="primary"
                key="key2"
                onClick={() => setOpenTermsCondition(true)}
              >
                Verify
              </Button>
              {/* </Popconfirm> */}
            </Space>
          ) : data?.verification?.at(-1).status == "approved" ? (
            <Popconfirm
              title="Are you sure ?"
              okText="Confirm"
              onConfirm={() => decline(data?._id)}
              key="confirm-key"
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
          ) : (
            <Button
              onClick={() =>
                setOpenVerificationHistory({
                  open: true,
                  data: data?.verification,
                })
              }
              key="btn-1"
            >
              Verification History
            </Button>
          ),
        ]}
      >
        <Row>
          <Col span={6}>
            <RoundedContainer>
              <Typography style={{ fontSize: "2em" }}>{data?.name}</Typography>
              <Space>
                <div>
                  {data?.verification?.at(-1).status == "approved" ? (
                    <Tag color="#87d068">VERIFIED</Tag>
                  ) : (
                    <Tag color="red">UNVERIFIED</Tag>
                  )}
                  {data?.tenantType != undefined && (
                    <>
                      {data?.tenantType == "male" ? (
                        <Tag color="blue">MALE</Tag>
                      ) : data?.tenantType == "female" ? (
                        <Tag color="#ffc0cb">FEMALE</Tag>
                      ) : (
                        <Tag color="#ff00ff">Mix</Tag>
                      )}
                    </>
                  )}
                </div>
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
            <RoundedContainer
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconText
                    icon={<MdMyLocation size={20} />}
                    text="Map"
                    fontSize={20}
                  />
                  <Button
                    type="text"
                    onClick={() =>
                      setFullMapConfig({
                        open: true,
                        coordinates: data?.coordinates ?? [0, 0],
                      })
                    }
                  >
                    View Full Map
                  </Button>
                </div>
              }
            >
              <Map
                coordinates={data?.coordinates ?? [0, 0]}
                viewOnly={true}
                styles={{ height: 300 }}
              />
            </RoundedContainer>
          </Col>
          <Col span={18}>
            <RoundedContainer
              title={
                <IconText
                  icon={<AiOutlineInfoCircle size={18} />}
                  text="Additional Info"
                  fontSize={16}
                />
              }
            >
              ({data?.totalOccupied ?? 0}/{data?.totalSpaceForRent ?? 0}) No. Of
              vacancy
              <br />
              Type of establishment(s): {data?.type?.join(", ")}
              <br />
              {data?.firstPaymentRule}
            </RoundedContainer>
            <RoundedContainer
              title={
                <IconText
                  icon={<AiOutlineInfoCircle size={18} />}
                  text="Package Inclusions"
                  fontSize={16}
                />
              }
            >
              {data?.inclusions?.map((e) => (
                <Tag key={e}>{e}</Tag>
              ))}
            </RoundedContainer>
            <RoundedContainer
              title={
                <IconText
                  icon={<AiOutlineInfoCircle size={18} />}
                  text="Restrictions"
                  fontSize={16}
                />
              }
            >
              <ul style={{ marginLeft: 20 }}>
                {data?.restrictions?.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
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
                <Image.PreviewGroup>
                  <Space>
                    {data?.establishmentPhotos.map((e) => (
                      <Image width={300} src={e} key={e} />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              </RoundedContainer>
            )}

            {data?.businessPermitPhoto != null && (
              <RoundedContainer
                title={
                  <IconText
                    icon={<BsImages size={20} />}
                    text="Business Permit"
                    fontSize={20}
                  />
                }
              >
                <Image width={300} src={data?.businessPermitPhoto} />
              </RoundedContainer>
            )}
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default FullViewer;
