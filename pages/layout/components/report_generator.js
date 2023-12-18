import React, { useRef } from "react";
import { Drawer, Button, Table, Typography, Col, Image } from "antd";
import { useReactToPrint } from "react-to-print";

const ReportGenerator = ({ columns, data, open, close, title }) => {
  const ref = useRef();

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <Drawer
      open={open}
      onClose={close}
      placement="bottom"
      height="100%"
      title="Print Preview"
      extra={[
        <Button onClick={handlePrint} key="key1">
          PRINT
        </Button>,
      ]}
      bodyStyle={{
        textAlign: "center",
      }}
      style={{
        width: 900,
        marginLeft: "50%",
        transform: "translateX(-50%)",
      }}
      zIndex={999}
    >
      <div ref={ref}>
        <div
          style={{
            minWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image preview={false} width={120} src="buksu-log.png" />
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Typography.Title
              level={3}
              style={{
                fontFamily: "Baskerville",
                margin: 0,
                fontWeight: 900,
              }}
            >
              BUKIDNON STATE UNIVERSITY
            </Typography.Title>
            <Typography.Text
              style={{
                fontFamily: "Baskerville",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Malaybalay City, Bukidnon 8700
            </Typography.Text>
            <br />
            <Typography.Text
              style={{
                fontFamily: "Baskerville",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717,{" "}
              <a
                href="#"
                style={{
                  textDecoration: "underline",
                }}
              >
                www.buksu.edu.ph
              </a>
            </Typography.Text>
          </div>
          <Image preview={false} width={120} src="oss-logo.png" />
        </div>
        <div style={{ marginTop: 15 }}>
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            {title}
          </Typography.Title>

          <Table
            className="myTable"
            rowClassName="custom-table"
            pagination={false}
            dataSource={data}
            columns={columns}
            bordered
          />
          {/* <Col span={5} style={{ marginTop: 100 }}>
            <Typography.Text>Jean Paulith B. Elcano</Typography.Text>
            <br />
            <Typography.Text style={{ borderTop: "1px solid #000" }}>
              Social Welfare Assistant
            </Typography.Text>
          </Col> */}
        </div>
      </div>
    </Drawer>
  );
};

export default ReportGenerator;
