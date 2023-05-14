import React, { useEffect, useState } from "react";
import { Result, Steps, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ContentWithSteps = ({ data }) => {
  const [lastStatus, setLastStatus] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const _lastStatus = data?.status.at(-1)?.name;
    if (data) setLastStatus(_lastStatus);

    if (_lastStatus == "draft") setIndex(0);
    if (_lastStatus == "pending") setIndex(1);
    if (_lastStatus == "rejected" || _lastStatus == "accepted") setIndex(2);
  }, [data]);

  return (
    <>
      <Steps
        current={index}
        items={[
          {
            title: "Draft",
            description: "Confirm your request",
          },
          {
            title: "Pending",
            description: "Wait for the land owner to respond",
            icon: index == 1 ? <LoadingOutlined /> : null,
          },
          {
            title: "Status",
          },
        ]}
      />
      {index == 0 && <>0</>}
      {index == 2 && (
        <Result
          status={lastStatus == "accepted" ? "success" : "error"}
          title={
            lastStatus == "accepted"
              ? "Your request has been accepted"
              : "Your request has been declined"
          }
        >
          {lastStatus == "rejected" && (
            <div className="desc">
              <Typography.Paragraph>
                <Typography.Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  The Landlord/Landlady rejected your request with a reason:
                </Typography.Text>
              </Typography.Paragraph>
              <Typography.Paragraph>
                {data?.status.at(-1).reason}
              </Typography.Paragraph>
            </div>
          )}
        </Result>
      )}
    </>
  );
};

export default ContentWithSteps;
