import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
  Grid,
  Box,
  CssBaseline,
  Button,
  Toolbar,
  AppBar,
  Typography
} from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AppLink from "../../components/app-link";
import Section from "./home-section";
import logo from "../../logo.svg";

const content = [
  {
    title: "When a simple thank you is not enough, Applaud them ",
    byline: "Make recognition fun. Love your work.",
    image: "homepage-images/coworkers.svg",
    imageLeft: true
  },
  {
    title: "Invigorate your team with acts of kindness",
    byline: "Make recognition more impactful by connecting it to your company’s core values and giving visibility to everyone’s contributions.",
    image: "homepage-images/team_spirit.svg",
    imageLeft: false
  },
  {
    title: "Increase engagement and commitment with team members",
    byline: "Build a scalable culture of recognition by empowering everyone to recognize their peers, direct reports, and managers.",
    image: "homepage-images/discussion.svg",
    imageLeft: true
  },
  {
    title: "Discover the greatness of your team",
    byline: "Encourage frequent and timely recognition by integrating with the communication tools your employees use every day.",
    image: "homepage-images/connection.svg",
    imageLeft: false
  }
];

const patches = [
  {
    image: "homepage-images/green.svg",
    class: "green"
  },
  {
    image: "homepage-images/maroon.svg",
    class: "maroon"
  },
  {
    image: "homepage-images/skyblue.svg",
    class: "skyblue"
  },
  {
    image: "homepage-images/rose.svg",
    class: "rose"
  },
  {
    image: "homepage-images/blue.svg",
    class: "blue"
  }
];

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: "relative",
      '&::-webkit-scrollbar': {
        width: 0,
        background: 'transparent'
      }
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
      width: "50%",
      right: "-2%"
    },
    maroon: {
      top: "15%",
      width: "7%",
      left: "-3%"
    },
    skyblue: {
      top: "27%",
      width: "48%",
      right: "-2%"
    },
    rose: {
      top: "35%",
      width: "7%",
      left: "2%"
    },
    blue: {
      bottom: "-7%",
      width: "22%",
      left: "-5%"
    },
    toolbar: {
      justifyContent: "space-between"
    },
    logo: {
      maxWidth: 200
    }
  })
);

interface Props {
  children: React.ReactElement;
}

function LandingPage() {
  const classes = useStyles();

  function ColorChangeScroll(props: Props) {
    const {children} = props;
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0
    });

    return React.cloneElement(children, {
      color: trigger ? "rgba(255, 255, 255, 0.5)" : "transparent",
    });
  }

  return (
    <div id="home" className={classes.container}>
      <CssBaseline/>
      <Box display={{xs: "none", lg: "block"}}>
        {patches.map((patch, index) => (
          <img
            alt="patch"
            src={patch.image}
            style={{position: "absolute"}}
            className={classes[patch.class as keyof typeof classes]}
            key={index}
          />
        ))}
      </Box>
      <ColorChangeScroll>
        <AppBar color="transparent" className={classes.bar}>
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.logo}/>
            <AppLink to="/login">
              <Button
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </AppLink>
          </Toolbar>
        </AppBar>
      </ColorChangeScroll>
      <Box pt={5}>
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
      </Box>
      <Box mt={5}>
        <Typography align="center">
          Handcrafted with <span style={{color: '#ea4e4e'}}>&#9829;</span> by theGeeksTribe
        </Typography>
      </Box>
    </div>
  );
}

export default LandingPage;
