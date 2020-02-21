import React from "react";
import { Box, createStyles, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  title: string;
  byline: string;
  image: string;
  imageLeft: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      width: "90%"
    },
    grid: {
      margin: "5em 0"
    }
  })
);

function Section(props: Props) {
  const classes = useStyles();
  const { title, byline, image, imageLeft = false } = props;

  return (
    <Grid
      item
      container
      xs={8}
      direction={imageLeft ? "row-reverse" : "row"}
      justify="space-between"
      alignItems="center"
      className={classes.grid}
    >
      <Grid item xs={12} md={4}>
        <Typography variant="h5">{title}</Typography>
        {byline && <Typography variant="subtitle1">{byline}</Typography>}
      </Grid>
      <Grid item xs={12} md={4}>
        <img src={image} className={classes.image} />
      </Grid>
    </Grid>
  );
}

export default Section;
