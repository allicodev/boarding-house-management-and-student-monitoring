import React, { useEffect, useState } from "react";

const DashboardCard = ({ label = "", value, color, index, onClick }) => {
  const [_index, setIndex] = useState(-1);

  const addOpacity = (_color, opacity = 1) => {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return _color + _opacity.toString(16)?.toUpperCase() || "#ffffff00";
  };

  return (
    <div
      style={{
        border: "1px solid grey",
        backgroundColor: "#cecece",
        borderRadius: 5,
        // backgroundColor:
        //   index == _index ? addOpacity(color, 0.9) : addOpacity(color, 0.5),
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        width: "100%",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIndex(index)}
      onMouseLeave={() => setIndex(-1)}
      onClick={() => onClick(index)}
    >
      <strong>{label.toUpperCase()}</strong>
      <br />
      {value}
    </div>
  );
};

export default DashboardCard;
