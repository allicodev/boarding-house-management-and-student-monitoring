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
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const clear = () => {
    setSelectedCollege("");
    setSelectedCourse("");
    setSelectedBarangay("");
    setYear("");
    setGender("");
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
              clearFilter();
              clear();
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              onGenerateList(
                selectedCollege,
                selectedCourse,
                selectedBarangay,
                year,
                gender
              );
              message.success("Generate success");
              close();
            }}
          >
            Generate List
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onFilterSubmit(
                selectedCollege,
                selectedCourse,
                selectedBarangay,
                year,
                gender
              );
              message.success("Filters applied");
              clear();
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
          Year Level <br />
          <Select
            style={{ width: 300 }}
            options={[
              { label: "First year", value: "1" },
              { label: "Second year", value: "2" },
              { label: "Third year", value: "3" },
              { label: "Fourth year", value: "4" },
            ]}
            onSelect={(e) => setYear(e)}
            value={year}
          />
        </div>
        <div>
          Establishment Vicinity <br />
          <Select
            style={{ width: 300 }}
            options={jason.barangay}
            onSelect={(e) => setSelectedBarangay(e)}
            value={selectedBarangay}
          />
        </div>
        <div>
          Gender <br />
          <Select
            style={{ width: 300 }}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            onSelect={(e) => setGender(e)}
            value={gender}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default FilterForm;
