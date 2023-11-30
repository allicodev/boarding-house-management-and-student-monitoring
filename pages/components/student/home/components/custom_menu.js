import React, { useState } from "react";
import { Segmented, Space } from "antd";

const CustomMenu = ({ onViewChanged }) => {
  const [view, setView] = useState("list");
  return (
    <Space>
      <Segmented
        defaultValue={view}
        value={view}
        options={[
          { label: "List View", value: "list" },
          { label: "Grid View", value: "grid" },
        ]}
        style={{ marginBottom: 5, padding: 5 }}
        onChange={(e) => {
          setView(e);
          onViewChanged(e);
        }}
      />
    </Space>
  );
};

export default CustomMenu;
