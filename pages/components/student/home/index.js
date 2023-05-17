import React, { useEffect, useState } from "react";
import { mockData } from "../../../assets/utilities";
import FullViewer from "./components/full_viewer";
import CustomMenu from "./components/custom_menu";
import { ListView, GridView } from "./components/list_grid_view";
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";

const Home = () => {
  const [openFullDetails, setOpenFullDetails] = useState({
    open: false,
    data: {},
  });
  const [view, setView] = useState("list");
  const [establishment, setEstablishment] = useState([]);

  let fullViewerEntry = {
    open: openFullDetails.open,
    data: openFullDetails.data,
    close: () => setOpenFullDetails({ open: false, data: {} }),
  };

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/landlord/get-establishments");

      if (data.status == 200) setEstablishment(data.establishment);
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
