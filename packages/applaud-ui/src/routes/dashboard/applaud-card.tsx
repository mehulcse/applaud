import React, { useState } from "react";
import Lottie from "react-lottie";
import { Typography, Box } from "@material-ui/core";
import MarkdownIt from "markdown-it";
import { applaudCardData } from "../../helper/getApplaudCard";
import PaperBox from "../../components/paper-box";
import { getDate } from "../../helper/getDate";
import "./dashboard.css";

const mdParser = new MarkdownIt();

interface Props {
  data: any;
  showName: boolean;
  hideGifs: boolean;
}

const ApplaudCard = ({ data, showName, hideGifs }: Props) => {
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
  };

  const renderHTML = (text: string) => {
    return mdParser.render(text);
  };

  const cardType = applaudCardData.find(card => card.id === data.type);
  return (
    <Box mb={2}>
      <PaperBox
        elevation={2}
        className="applaud-quote"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {!hideGifs && (
          <Lottie
            options={{
              animationData: cardType && cardType.animation,
              ...defaultOptions
            }}
            isPaused={paused}
          />
        )}
        <Typography align="center" variant="h6">
          {cardType ? cardType.header : ""}
        </Typography>
        {data.message && (
          <blockquote>
            {showName && (
              <Typography align="left" variant="subtitle2">
                <strong>
                  {data && data.allocatedToUser
                    ? `${data.allocatedToUser.firstName}, `
                    : ""}
                </strong>
              </Typography>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: renderHTML(data.message) }}
            />
            <span className="author">
              <i>{getDate(data.createdAt)}</i>
            </span>
          </blockquote>
        )}
      </PaperBox>
    </Box>
  );
};

export default ApplaudCard;
