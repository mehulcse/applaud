import React, { useContext, useState } from "react";
import PageLayout from "../../components/page-layout";
import { AuthContext } from "../../core/auth-manager";
import { useApplaudQuery } from "../../generated/graphql";
import { Typography, Grid, FormControlLabel, Switch } from "@material-ui/core";
import { PAGE_LIMIT } from "../../constants/constants";
import "./dashboard.css";
import ApplaudSection from "./applaud-section";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [hideGifs, setHideGifs] = useState(false);

  const applaudStreamQuery = useApplaudQuery({
    variables: {
      limit: PAGE_LIMIT
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const applaudReceivedQuery = useApplaudQuery({
    variables: {
      limit: PAGE_LIMIT,
      allocatedToUserId:
        authContext && authContext.user && authContext.user.id
          ? authContext.user.id
          : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const applaudGivenQuery = useApplaudQuery({
    variables: {
      limit: PAGE_LIMIT,
      allocatedByUserId:
        authContext && authContext.user && authContext.user.id
          ? authContext.user.id
          : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  return (
    <PageLayout pageTitle="Dashboard">
      <Grid container xs={12} justify="flex-end" item>
        <Grid item>
          <FormControlLabel
            value="start"
            control={
              <Switch
                onChange={() => setHideGifs(!hideGifs)}
                checked={hideGifs}
              />
            }
            label="Hide Gif Images"
            labelPlacement="start"
          />
        </Grid>
      </Grid>
      <Grid container xs={12} spacing={3} item>
        <Grid xs={4} item>
          <Typography align="center">Applaud Received</Typography>
          <ApplaudSection
            queryResult={applaudReceivedQuery}
            showName={false}
            hideGifs={hideGifs}
          />
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Given</Typography>
          <ApplaudSection
            queryResult={applaudGivenQuery}
            showName={true}
            hideGifs={hideGifs}
          />
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Stream</Typography>
          <ApplaudSection
            queryResult={applaudStreamQuery}
            showName={true}
            hideGifs={hideGifs}
          />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Dashboard;
