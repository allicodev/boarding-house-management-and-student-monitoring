import React, { useState } from "react";
import { Button, Modal, Select, Space, message } from "antd";
import jason from "../../../../assets/json/constant.json";

const FilterForm = ({ open, close, onFilterSubmit, clearFilter }) => {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  return (
    <Modal
      open={open}
      onCancel={close}
      footer={
        <Space>
          <Button
            onClick={() => {
              message.success("Filter Cleared");
              setSelectedCollege("");
              setSelectedCourse("");
              clearFilter();
              close();
            }}
          >
            Clear Filter
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onFilterSubmit(selectedCollege, selectedCourse);
              message.success("Filters applied");
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
      </Space>
    </Modal>
  );
};

export default FilterForm;
