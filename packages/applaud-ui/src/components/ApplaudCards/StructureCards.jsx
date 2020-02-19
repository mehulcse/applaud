import React, { Component } from "react";
import Lottie from "react-lottie";
import animationData from "../../lotties/4999-rocket";

class StructureCards extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <div>
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
    );
  }
}

export default StructureCards;
