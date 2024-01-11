import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  List,
  Modal,
  Tooltip,
  Typography,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const StudentHistory = ({ open, close, data, id, refresh, viewOnly }) => {
  const [text, setText] = useState("");
  const [isViolation, setIsViolation] = useState(false);
  const [loader, setLoader] = useState("");

  const confirm = () => {
    setLoader("1");
    (async (_) => {
      let res = await _.post("/api/student/add-history", {
        text,
        id,
        isViolation,
      });

      if (res.data.status == 200) {
        setLoader("");
        refresh();
        message.success("Added history");
        close();
      } else {
        setLoader("");
      }
    })(axios);
  };
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={viewOnly}
      footer={null}
      title={viewOnly ? null : "Boarder's Feedback"}
      destroyOnClose
    >
      {!viewOnly && (
        <>
          <Input.TextArea
            placeholder="Input Here..."
            onChange={(e) => setText(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox onChange={(e) => setIsViolation(e.target.checked)}>
              Label as violation
            </Checkbox>
            <Button
              style={{ marginTop: 10 }}
              type="primary"
              loading={loader != ""}
              onClick={() => {
                // * validate

                if (text == "") {
                  message.warning("Text is blank. Please Provide.");
                  return;
                }

                confirm();
              }}
            >
              ADD
            </Button>
          </div>
        </>
      )}

      <Typography.Title
        level={5}
        style={{ marginTop: 20, marginBottom: 5, marginLeft: 10 }}
      >
        List of History
      </Typography.Title>
      <List
        size="small"
        style={{
          height: 250,
          overflow: "scroll",
        }}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ color: item.isViolation ? "red" : null }}>
            <Tooltip title={item.isViolation ? "Violation" : ""}>
              [{dayjs(item.createdAt).format("MMMM DD, YYYY")}] {item.text}
            </Tooltip>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default StudentHistory;
