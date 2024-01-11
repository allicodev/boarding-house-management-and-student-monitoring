import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Select, Space, message } from "antd";

import FullViewer from "./components/full_viewer";
import CustomMenu from "./components/custom_menu";
import { ListView, GridView } from "./components/list_grid_view";
import { FilterOutlined } from "@ant-design/icons";

import jason from "../../../assets/json/constant.json";

const Home = () => {
  const [view, setView] = useState("list");
  const [establishment, setEstablishment] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [openFullDetails, setOpenFullDetails] = useState({
    open: false,
    data: {},
  });

  let fullViewerEntry = {
    open: openFullDetails.open,
    data: openFullDetails.data,
    close: () => setOpenFullDetails({ open: false, data: {} }),
  };

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/student/get-establishments", {
        params: {
          ...(selectedBarangay != "" ? { barangay: selectedBarangay } : {}),
          ...(selectedType.length != 0
            ? { type: JSON.stringify(selectedType) }
            : {}),
        },
      });
      if (data.status == 200) setEstablishment(data.data);
      else message.error(data.message);
    })();
  }, [trigger]);

  return (
    <>
      <Modal
        title="Filter"
        open={openFilter}
        onCancel={() => setOpenFilter(false)}
        footer={
          <Space>
            <Button
              onClick={() => {
                setSelectedBarangay("");
                setTrigger(trigger + 1);
                setOpenFilter(false);
              }}
            >
              RESET
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setTrigger(trigger + 1);
                setOpenFilter(false);
              }}
            >
              APPLY FILTER
            </Button>
          </Space>
        }
        closable={false}
        width={350}
        destroyOnClose
      >
        <div>
          Barangay <br />
          <Select
            style={{ width: 300 }}
            options={jason.barangay}
            onSelect={(e) => setSelectedBarangay(e)}
            value={selectedBarangay}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          Accommodation Type <br />
          <Select
            style={{ width: 300 }}
            mode="multiple"
            onChange={(e) => setSelectedType(e)}
            options={["Pad", "Boarding House", "Bed Spacer", "Dormitory"].map(
              (e) => {
                return {
                  label: e,
                  value: e,
                };
              }
            )}
          />
        </div>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CustomMenu onViewChanged={(e) => setView(e)} />
        <Button onClick={() => setOpenFilter(true)}>
          Filter
          <FilterOutlined />
        </Button>
      </div>

      {view == "list" ? (
        <ListView
          source={establishment}
          setOpenFullDetails={setOpenFullDetails}
        />
      ) : (
        <GridView
          source={establishment}
          setOpenFullDetails={setOpenFullDetails}
        />
      )}

      {/* UTILS */}
      <FullViewer {...fullViewerEntry} />
    </>
  );
};

export default Home;
