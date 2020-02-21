import React, {useState} from "react";
import Lottie from "react-lottie";
import {Typography, Box, Grid} from "@material-ui/core";
import {applaudCardData} from "../../helper/getApplaudCard";
import PaperBox from "../../components/paper-box";
import {getDate} from "../../helper/getDate";
import "./dashboard.css"

interface Props {
  data: any
}

const ApplaudCard = ({data}: Props) => {
  const defaultOptions = {
    loop: true,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const [paused, setPaused] = useState(true);

  const onMouseEnter = () => {
    setPaused(false);
  };

  const onMouseLeave = () => {
    setPaused(true);
  }

  const cardType = applaudCardData.find(card => card.id === data.type);
  return (
    <Box mb={2}>
      <PaperBox elevation={2} className="applaud-quote"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
        <Lottie options={{animationData: cardType && cardType.animation, ...defaultOptions}}
                isPaused={paused}/>
        <Typography align="center" variant="h6">{cardType ? cardType.header : ''}</Typography>
        {data.message && <blockquote>
          {data.message}
          <span className="author"><i>{getDate(data.createdAt)}</i></span>
        </blockquote>}
      </PaperBox>
    </Box>
  )
};

export default ApplaudCard;
