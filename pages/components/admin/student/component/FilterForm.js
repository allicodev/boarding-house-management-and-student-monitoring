import React, { useState } from "react";
import { Button, Modal, Select, Space, message } from "antd";
import jason from "../../../../assets/json/constant.json";

const FilterForm = ({
  open,
  close,
  onFilterSubmit,
  onGenerateList,
  clearFilter,
}) => {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  const clear = () => {
    setSelectedCollege("");
    setSelectedCourse("");
    setSelectedBarangay("");
    close();
  };

  return (
    <Modal
      open={open}
      onCancel={clear}
      width="25%"
      footer={
        <Space>
          <Button
            onClick={() => {
              message.success("Filter Cleared");
              clear();
            }}
          >
            Clear
          </Button>
          <Button
            disabled={selectedBarangay == ""}
            onClick={() => {
              onGenerateList(selectedCollege, selectedCourse, selectedBarangay);
              close();
            }}
          >
            Generate List
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onFilterSubmit(selectedCollege, selectedCourse, selectedBarangay);
              message.success("Filters applied");
              clear();
              close();
            }}
          >
            Apply Filter
          </Button>
        </Space>
      }
      closable={false}
      destroyOnClose
    >
      <Space direction="vertical">
        <div>
          College <br />
          <Select
            style={{ width: 300 }}
            options={jason.colleges.map((e) => {
              return { label: e.label, value: e.value };
            })}
            onSelect={(e) => {
              setSelectedCollege(e);
              setSelectedCourse("");
            }}
            value={selectedCollege}
          />
        </div>
        <div>
          Course <br />
          <Select
            style={{ width: 300 }}
            disabled={selectedCollege == ""}
            options={
              selectedCollege != ""
                ? jason.colleges
                    .filter((e) => e.value == selectedCollege)[0]
                    .courses.map((e) => {
                      return {
                        label: e,
                        value: e,
                      };
                    })
                : null
            }
            onSelect={(e) => setSelectedCourse(e)}
            value={selectedCourse}
          />
        </div>
        <div>
          Barangay <br />
          <Select
            style={{ width: 300 }}
            options={jason.barangay}
            onSelect={(e) => setSelectedBarangay(e)}
            value={selectedBarangay}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default FilterForm;
