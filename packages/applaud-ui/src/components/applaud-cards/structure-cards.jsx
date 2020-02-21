import React, { useState } from "react";
import Lottie from "react-lottie";
import { Typography, Paper } from "@material-ui/core";
import "./cards.css";

const StructureCards = ({ data, onClick, selected }) => {
  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: data.animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [paused, setPaused] = useState(true);

  function onMouseEnter() {
    setPaused(false);
  }

  function onMouseLeave() {
    setPaused(true);
  }

  return (
    <Paper
      className="card-tiles"
      id={data.id}
      onClick={onClick}
      elevation={selected ? 24 : 5}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Typography
        className={data.header}
        color="textSecondary"
        gutterBottom
        style={{
          fontFamily: "Griffy",
          color: "#3FBEED",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        {data.header}
      </Typography>
      <Lottie options={defaultOptions} className="lottieFiles" isPaused={paused} />
    </Paper>
  );
};

export default StructureCards;