import React, { useRef } from "react";
import { Drawer, Button, Table, Typography, Col, Image } from "antd";
import { useReactToPrint } from "react-to-print";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

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
    >
      <PDF ref={ref}>
        <div style={{ marginTop: 15 }}>
          <Typography.Title level={3} style={{ textAlign: "center" }}>
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
      </PDF>
    </Drawer>
  );
};

export default ReportGenerator;
