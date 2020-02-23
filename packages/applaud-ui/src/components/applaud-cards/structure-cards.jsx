import React, { useState } from "react";
import Lottie from "react-lottie";
import { Typography, Paper, withStyles } from "@material-ui/core";
import "./cards.css";

// TODO: Change color for light theme
const StyledPaper = withStyles({
  root: {
    padding: "10px 10px 40px",
    textAlign: "center",
    margin: "5px 10px 5px 0",
    position: "relative",
    width: "100%",
    height: "200px"
  },
  elevation24: {
    boxShadow: "0 11px 15px -7px rgba(255, 255,255,0.2), 0 24px 38px 3px rgba(255,255,255,0.14), 0 9px 46px 8px rgba(255,255,255,0.12)"
  }
})(Paper);

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
    <StyledPaper
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
    </StyledPaper>
  );
};

export default StructureCards;