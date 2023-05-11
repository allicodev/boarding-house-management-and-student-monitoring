import React from "react";
import { Drawer } from "antd";

const FullViewer = ({ open, close }) => {
  return (
    <Drawer
      open={open}
      onClose={close}
      placement="bottom"
      height="100%"
    ></Drawer>
  );
};

export default FullViewer;
