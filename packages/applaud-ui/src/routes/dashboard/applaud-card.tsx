import React, {useState} from "react";
import Lottie from "react-lottie";
import {Typography, Box} from "@material-ui/core";
import {applaudCardData} from "../../helper/getApplaudCard";
import {makeStyles, Theme} from "@material-ui/core/styles";
import PaperBox from "../../components/paper-box";
import {getDate} from "../../helper/getDate";
import "./dashboard.css"
import {amber, green} from "@material-ui/core/colors";

interface Props {
  data: any;
  showName: boolean;
  hideGifs: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  date: {
    backgroundColor: theme.palette.background.paper
  }
}));

const ApplaudCard = ({data, showName, hideGifs}: Props) => {
  const classes = useStyles();
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
        {!hideGifs && <Lottie options={{animationData: cardType && cardType.animation, ...defaultOptions}}
                              isPaused={paused}/>}
        <Typography align="center" variant="h6">{cardType ? cardType.header : ''}</Typography>
        {data.message && <blockquote>
          {showName &&
          <Typography align="left" variant="subtitle2">
            <strong>
              {data && data.allocatedToUser ? `${data.allocatedToUser.firstName}, ` : ''}
            </strong>
          </Typography>}
          {data.message}
          <Typography variant="body2" component="span" className='author'>
            <Typography variant="body2" component="i" className={classes.date}>{getDate(data.createdAt)}</Typography>
          </Typography>
        </blockquote>}
      </PaperBox>
    </Box>
  )
};

export default ApplaudCard;
