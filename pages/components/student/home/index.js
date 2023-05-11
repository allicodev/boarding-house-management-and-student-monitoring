import React, { useState } from "react";
import { mockData } from "../../../assets/utilities";
import FullViewer from "./components/full_viewer";
import CustomMenu from "./components/custom_menu";
import { ListView, GridView } from "./components/list_grid_view";

const Home = () => {
  const [openFullDetails, setOpenFullDetails] = useState({
    open: false,
    data: {},
  });
  const [view, setView] = useState("list");

  let fullViewerEntry = {
    open: openFullDetails.open,
    data: openFullDetails.data,
    close: () => setOpenFullDetails({ open: false, data: {} }),
  };

  return (
    <>
      <CustomMenu onViewChanged={(e) => setView(e)} />

      {view == "list" ? (
        <ListView
          source={mockData["student-table"]}
          setOpenFullDetails={setOpenFullDetails}
        />
      ) : (
        <GridView
          source={mockData["student-table"]}
          setOpenFullDetails={setOpenFullDetails}
        />
      )}

      {/* UTILS */}
      <FullViewer {...fullViewerEntry} />
    </>
  );
};

export default Home;
