import React, { Component } from "react";
import Lottie from "react-lottie";
import Typography from "@material-ui/core/Typography";
import "./cards.css";

const StructureCards = ({ data }) => {
  // render() {

  // }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data.animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <section className="card-tiles" id={data.id}>
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
      <Lottie options={defaultOptions} className="lottieFiles" />
    </section>
  );
};

export default StructureCards;
