import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import "./styles.css";

const ApplaudCard = ({ data }) => {
  return (
    <Card variant="outlined" id={data.id} className="applaudCard">
      <CardContent>
        <CardMedia
          component="img"
          alt={data.altName}
          //height="140"
          image={data.imageUrl}
          title={data.header}
        />
        <Typography
          className={data.header}
          color="textSecondary"
          gutterBottom
          style={{ fontFamily: "Griffy", color: "pink" }}
        >
          {data.header}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ApplaudCard;
