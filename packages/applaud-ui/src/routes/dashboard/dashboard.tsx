import React, {useContext} from "react";
import PageLayout from "../../components/page-layout";
import {AuthContext} from "../../core/auth-manager";
import {useApplaudQuery, ApplaudQueryHookResult} from "../../generated/graphql";
import {Typography, Paper, Box, Grid} from "@material-ui/core";
import {applaudCardData} from "../applaud/applaud-form";

function Dashboard() {
  const authContext = useContext(AuthContext);
  const applaudStreamQuery = useApplaudQuery({
    variables: {},
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const applaudReceivedQuery = useApplaudQuery({
    variables: {
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
      allocatedByUserId:
        authContext && authContext.user && authContext.user.id
          ? authContext.user.id
          : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const renderApplauds = (applaudQueryResult: ApplaudQueryHookResult) => {
    if (applaudQueryResult.data &&
      applaudQueryResult.data.applaud &&
      applaudQueryResult.data.applaud.nodes) {
      return applaudQueryResult.data.applaud.nodes.map((data: any, index: number) => {
        const cardType = applaudCardData.find(card => card.id === data.type);
        return (
          <Box mb={2} key={index}>
            <Paper elevation={2}>
              {cardType ? cardType.header : ''}
              {data.message}
              {data.createdAt}
            </Paper>
          </Box>
        )
      })
    }
    return null
  };

  return (
    <PageLayout pageTitle="Dashboard">
      <Grid container xs={12} spacing={6} item>
        <Grid xs={4} item>
          <Typography align="center">Applaud Received</Typography>
          {renderApplauds(applaudReceivedQuery)}
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Given</Typography>
          {renderApplauds(applaudGivenQuery)}
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Stream</Typography>
          {renderApplauds(applaudStreamQuery)}
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default Dashboard;
