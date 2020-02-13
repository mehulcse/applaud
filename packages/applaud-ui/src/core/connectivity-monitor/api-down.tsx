import React from "react";
import { Paper, Typography, Grid } from "@material-ui/core";
import theme from "../../core/mui-theme";
import AppIcon from "../../components/app-icon";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export const ApiDown = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <Paper
        style={{
          padding: theme.spacing(4),
          maxWidth: 400,
          marginTop: theme.spacing(1)
        }}
      >
        <Typography variant="h4" gutterBottom>
          Oops...
        </Typography>
        <Grid container>
          <Grid item xs={3}>
            <AppIcon icon={faExclamationTriangle} size="4x" />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1">
              We're having some technical difficulties at the moment. As soon as
              things are resolved, this page will automatically refresh.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};