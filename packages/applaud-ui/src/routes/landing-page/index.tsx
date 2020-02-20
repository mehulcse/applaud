import React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Grid, Typography, CssBaseline, Button, Toolbar, AppBar } from "@material-ui/core";
import AppLink from "../../components/app-link";
import Section from "./home-section";

const content = [
    {
        title: 'When a simple thank you is not enough, Applaud them ',
        byline: '',
        image: 'homepage-images/coworkers.svg',
        imageLeft: false,
    },
    {
        title: 'Motivate team members and build stronger team ',
        byline: 'Motivate your team members in order to build stronger teams',
        image: 'homepage-images/team_spirit.svg',
        imageLeft: false,
    },
    {
        title: 'Increase engagement and commitment with team members',
        byline: 'Motivate your team members in order to build stronger teams',
        image: 'homepage-images/discussion.svg',
        imageLeft: true,
    },
    {
        title: 'Employees will feel more connected to their company ',
        byline: 'Motivate your team members in order to build stronger teams ',
        image: 'homepage-images/connection.svg',
        imageLeft: false,
    }
];

const useStyles = makeStyles(() =>
    createStyles({
        bar: {
            boxShadow: "none",
        },
        title: {
            flexGrow: 1,
            color: "#4C85E1"
        },
        button: {
            backgroundColor: "#E01E5A",
            color: "white",
        }
    }),
);

function LandingPage() {
    const classes = useStyles();

    return (
        <div id="home">
            <CssBaseline />
            <AppBar position="sticky" color="transparent" className={classes.bar}>
                <Toolbar>
                    <Typography variant="h3" className={classes.title}>
                        Applaud
                    </Typography>
                    <AppLink to="/login">
                        <Button className={classes.button}>Login</Button>
                    </AppLink>
                </Toolbar>
            </AppBar>
            <Grid
                container
                justify="center"
            >
                {content.map(section => <Section title={section.title} byline={section.byline} image={section.image} imageLeft={section.imageLeft}/>)}
            </Grid>
        </div>
    );
}

export default LandingPage;