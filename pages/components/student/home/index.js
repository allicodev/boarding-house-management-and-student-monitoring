import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

import FullViewer from "./components/full_viewer";
import CustomMenu from "./components/custom_menu";
import { ListView, GridView } from "./components/list_grid_view";

const Home = () => {
  const [view, setView] = useState("list");
  const [establishment, setEstablishment] = useState([]);
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
      let { data } = await axios.get("/api/student/get-establishments");
      if (data.status == 200) setEstablishment(data.data);
      else message.error(data.message);
    })();
  }, []);

  return (
    <>
      <CustomMenu onViewChanged={(e) => setView(e)} />

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
