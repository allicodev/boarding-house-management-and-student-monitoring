import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Typography,
  Spin,
  Tooltip,
  Row,
  Col,
  Divider,
  message,
} from "antd";

import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

import { UndoOutlined } from "@ant-design/icons";

const StudentTermsCondition = ({
  open,
  close,
  onProceed,
  studentId,
  landlordId,
}) => {
  const [student, setStudent] = useState();
  const [landlord, setLandlord] = useState();
  const [fetching, setFetching] = useState(false);
  const signatureRef2 = useRef(null);

  const clearSignature = (ref) => ref.current?.clear();

  useEffect(() => {
    if (open) {
      setFetching(true);
      if (studentId) {
        (async (_) => {
          let { data } = await _.get("/api/etc/get-user-by-id", {
            params: {
              id: studentId,
            },
          });
          if (data.status == 200) {
            setStudent(data.user);
            setFetching(false);
          } else {
            setFetching(false);
          }
        })(axios);
      }
      if (landlordId) {
        (async (_) => {
          let { data } = await _.get("/api/etc/get-user-by-id", {
            params: {
              id: landlordId,
            },
          });
          if (data.status == 200) {
            setLandlord(data.user);
            setFetching(false);
          } else {
            setFetching(false);
          }
        })(axios);
      }
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      width={500}
      title={
        <Typography.Title level={4}>TERMS AND CONDITIONS</Typography.Title>
      }
      bodyStyle={{
        height: 500,
        overflow: "scroll",
      }}
      zIndex={999}
      footer={
        <Button
          type="primary"
          onClick={() => {
            if (signatureRef2.current.isEmpty()) {
              message.warning("Signature is empty. Please provide.");
              return;
            }
            // console.log(signatureRef2.current.toDataURL());
            onProceed(signatureRef2.current.toDataURL());
            close();
          }}
          block /*disabled={!isBottom} */
        >
          I Understand and Agree to the Terms and Conditions
        </Button>
      }
    >
      <Spin spinning={fetching}>
        <Typography.Text style={{ color: "#777" }}>
          This Agreement is entered into on [Date-Student magbutang], between{" "}
          {landlord?.firstName + " " + landlord?.lastName} &quot;Landowner&quot;
          and {student?.firstName + " " + student?.lastName} &quot;Tenant&quot;.
          Services.
          <br />
          <br />
          <strong>RENTAL TERMS:</strong>
          <ol>
            <li>Rent Payment: Tenant agrees to pay the monthly rent.</li>
          </ol>
          <strong>UTILITIES AND MAINTENANCE:</strong>
          <ol>
            {[
              "Tenant's Obligation: Tenant shall maintain the premises in good condition and promptly report any necessary repairs to the Landowner.",
              "Utilities: Utilities are covered by the landlord.",
            ].map((e, i) => (
              <li key={`b-${i}`}>{e}</li>
            ))}
          </ol>
          <strong>RULES AND REGULATIONS:</strong>
          <ol>
            {[
              "Use of Premises: Tenant agrees to use the premises solely for residential purposes and comply with all applicable laws and regulations.",
              "Failure to Pay Rent: If Tenant fails to pay rent, Landowner may take legal action.",
            ].map((e, i) => (
              <li key={`c-${i}`}>{e}</li>
            ))}
          </ol>
          <br />
          <strong>DATA PRIVACY CLAUSE:</strong>
          <ol>
            <li>
              Confidentiality: Landowner agrees not to share any personal
              information provided by the Tenant, especially student
              information, with any third party, except the school, which
              co-manages the students&apos; data. The data will be used solely
              for the purpose of this agreement.
            </li>
          </ol>
        </Typography.Text>
        <strong>SIGNATURE</strong>
        <Row gutter={[32, 32]}>
          <Col span={12}>
            <div>
              <div style={{ position: "relative" }}>
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 200,
                    height: 200,
                    className: "signatureCanvas",
                    style: {
                      border: "1px solid #eee",
                      // position: "absolute",
                    },
                  }}
                  ref={signatureRef2}
                />
                <Tooltip title="reset">
                  <Button
                    icon={<UndoOutlined />}
                    style={{ position: "absolute", left: 3, top: 3 }}
                    onClick={() => clearSignature(signatureRef2)}
                  />
                </Tooltip>
              </div>
              <p style={{ textAlign: "center" }}>
                {student?.firstName + " " + student?.lastName}
              </p>
              <Divider
                style={{
                  padding: 0,
                  margin: 0,
                  backgroundColor: "#000",
                }}
              />
              <p style={{ textAlign: "center" }}>Tenant</p>
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default StudentTermsCondition;
