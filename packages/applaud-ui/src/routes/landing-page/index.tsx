import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  CssBaseline,
  Button,
  Toolbar,
  AppBar
} from "@material-ui/core";
import AppLink from "../../components/app-link";
import Section from "./home-section";
import logo from '../../logo.svg';

const content = [
  {
    title: "When a simple thank you is not enough, Applaud them ",
    byline: "",
    image: "homepage-images/coworkers.svg",
    imageLeft: false
  },
  {
    title: "Motivate team members and build stronger team ",
    byline: "Motivate your team members in order to build stronger teams",
    image: "homepage-images/team_spirit.svg",
    imageLeft: false
  },
  {
    title: "Increase engagement and commitment with team members",
    byline: "Motivate your team members in order to build stronger teams",
    image: "homepage-images/discussion.svg",
    imageLeft: true
  },
  {
    title: "Employees will feel more connected to their company ",
    byline: "Motivate your team members in order to build stronger teams ",
    image: "homepage-images/connection.svg",
    imageLeft: false
  }
];

const patches = [
  {
    image: "homepage-images/green.svg",
    class: "green",
  },
  {
    image: "homepage-images/maroon.svg",
    class: "maroon",
  },
  {
    image: "homepage-images/skyblue.svg",
    class: "skyblue",
  },
  {
    image: "homepage-images/rose.svg",
    class: "rose",
  },
  {
    image: "homepage-images/blue.svg",
    class: "blue",
  }
];

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: "relative",
      overflowX: "hidden"
    },
    bar: {
      boxShadow: "none"
    },
    title: {
      flexGrow: 1,
      color: "#4C85E1"
    },
    button: {
      backgroundColor: "#E01E5A",
      color: "white"
    },
    green: {
      top: "-1%",
      width: '50%',
      right: "-2%",
    },
    maroon: {
      top: "15%",
      width: '7%',
      left: "-3%",
    },
    skyblue: {
      top: "27%",
      width: '48%',
      right: "-2%",
    },
    rose: {
      top: "35%",
      width: '7%',
      left: "2%",
    },
    blue: {
      bottom: "-7%",
      width: '22%',
      left: "-5%",
    },
    toolbar: {
      justifyContent: 'space-between'
    },
    logo: {
      maxWidth: 200
    }
  })
);

function LandingPage() {
  const classes = useStyles();

  return (
    <div id="home" className={classes.container}>
      <CssBaseline />
        {patches.map((patch, index) => <img src={patch.image} style={{position:'absolute'}} className={classes[patch.class as keyof typeof classes]} key={index} />)}
      <AppBar color="transparent" className={classes.bar}>
        <Toolbar>
            <img src={logo} alt="logo" className={classes.logo} />
          <AppLink to="/login">
            <Button className={classes.button}>Login</Button>
          </AppLink>
        </Toolbar>
      </AppBar>
      <Grid container justify="center">
        {content.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            byline={section.byline}
            image={section.image}
            imageLeft={section.imageLeft}
          />
        ))}
      </Grid>
    </div>
  );
}

export default LandingPage;
