import React from "react";
import { Modal, Card, Avatar, message, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const StudentProfile = ({ open, close, data }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      footer={null}
      style={{ padding: 0 }}
      centered
    >
      <Card
        cover={<img alt="example" src={data?.profile_image} />}
        actions={[
          <CheckOutlined
            key="confirm"
            style={{ color: "#87d068" }}
            onClick={() => {
              close();
              message.success("accepted");
            }}
          />,
          <CloseOutlined
            key="declined"
            style={{ color: "#ff0000" }}
            onClick={() => {
              close();
              message.error("declined");
            }}
          />,
        ]}
      >
        <Card.Meta
          // avatar={<Avatar src={data?.profile_image} />}
          title={data?.requestor_name}
          description={
            <Typography.Paragraph type="secondary">
              Requeston on {data?.date_requested}
              <br />
              (id: {data?._id})
            </Typography.Paragraph>
          }
        />
      </Card>
    </Modal>
  );
};

export default StudentProfile;
