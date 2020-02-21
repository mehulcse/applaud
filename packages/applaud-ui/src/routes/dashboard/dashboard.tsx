import React, {useContext} from "react";
import PageLayout from "../../components/page-layout";
import {AuthContext} from "../../core/auth-manager";
import {useApplaudQuery} from "../../generated/graphql";
import {Typography, Paper, Box, Grid} from "@material-ui/core";

function Dashboard() {
  const authContext = useContext(AuthContext);
  const applaudStreamQuery = useApplaudQuery({
    variables: {},
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  })

  const applaudReceivedQuery = useApplaudQuery({
    variables: {
      allocatedToUserId: authContext && authContext.user && authContext.user.id ? authContext.user.id : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  })

  const applaudGivenQuery = useApplaudQuery({
    variables: {
      allocatedByUserId: authContext && authContext.user && authContext.user.id ? authContext.user.id : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  })

  return (
    <PageLayout pageTitle="Dashboard">
      <Grid container xs={12} spacing={6} item>
        <Grid xs={4} item>
          <Typography>Applaud Received</Typography>
          {applaudReceivedQuery && applaudReceivedQuery.data
          && applaudReceivedQuery.data.applaud && applaudReceivedQuery.data.applaud.nodes
          && applaudReceivedQuery.data.applaud.nodes.map((data, index) =>
            (<Box mb={2} key={index}>
              <Paper elevation={2}>
                {data.type}
                {data.message}
                {data.createdAt}
              </Paper>
            </Box>))}
        </Grid>
        <Grid xs={4} item>
          <Typography>Applaud Given</Typography>
          {applaudGivenQuery && applaudGivenQuery.data
          && applaudGivenQuery.data.applaud && applaudGivenQuery.data.applaud.nodes
          && applaudGivenQuery.data.applaud.nodes.map((data, index) =>
            (<Box mb={2} key={index}>
              <Paper elevation={2}>
                {data.type}
                {data.message}
                {data.createdAt}
              </Paper>
            </Box>))}
        </Grid>
        <Grid xs={4} item>
          <Typography>Applaud Stream</Typography>
          {applaudStreamQuery && applaudStreamQuery.data
          && applaudStreamQuery.data.applaud && applaudStreamQuery.data.applaud.nodes
          && applaudStreamQuery.data.applaud.nodes.map((data, index) =>
            (<Box mb={2} key={index}>
              <Paper elevation={2}>
                {data.type}
                {data.message}
                {data.createdAt}
              </Paper>
            </Box>))}
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default Dashboard;
