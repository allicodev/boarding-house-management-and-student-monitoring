import React, { useEffect } from "react";
import { Modal } from "antd";

const ModalTable = ({ open, close, data }) => {
  return <Modal open={open} onCancel={close}></Modal>;
};

export default ModalTable;
