import React, {useContext, useState} from "react";
import PageLayout from "../../components/page-layout";
import {AuthContext} from "../../core/auth-manager";
import {useApplaudQuery, ApplaudQueryHookResult} from "../../generated/graphql";
import {Typography, Box, Grid, FormControlLabel, Switch} from "@material-ui/core";
import PaperBox from "../../components/paper-box";
import Loader from "../../components/loader";
import {LOADER_TYPE} from "../../constants/constants";
import ApplaudCard from "./applaud-card";
import "./dashboard.css"

const CARDS_LIMIT = 1000;

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [hideGifs, setHideGifs] = useState(false);
  const applaudStreamQuery = useApplaudQuery({
    variables: {
      limit: CARDS_LIMIT
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const applaudReceivedQuery = useApplaudQuery({
    variables: {
      limit: CARDS_LIMIT,
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
      limit: CARDS_LIMIT,
      allocatedByUserId:
        authContext && authContext.user && authContext.user.id
          ? authContext.user.id
          : null
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  const renderApplauds = (applaudQueryResult: ApplaudQueryHookResult, showName: boolean) => {
    if (applaudQueryResult.data &&
      applaudQueryResult.data.applaud &&
      applaudQueryResult.data.applaud.nodes &&
      applaudQueryResult.data.applaud.nodes.length > 0) {
      return applaudQueryResult.data.applaud.nodes.map((data: any, index: number) => (
        <ApplaudCard data={data} key={index} showName={showName} hideGifs={hideGifs}/>
      ))
    }
    return (
      <Box mb={2}>
        <PaperBox elevation={2}>
          <Typography align="center">No Data Available</Typography>
        </PaperBox>
      </Box>
    )
  };

  return (
    <PageLayout pageTitle="Dashboard">
      <Grid container xs={12} justify="flex-end" item>
      <Grid item>
        <FormControlLabel
          value="start"
          control={
            <Switch onChange={() => setHideGifs(!hideGifs)} checked={hideGifs} />
          }
          label="Hide Gif Images"
          labelPlacement="start"
        />
      </Grid>
      </Grid>
      <Grid container xs={12} spacing={3} item>
        <Grid xs={4} item>
          <Typography align="center">Applaud Received</Typography>
          <Box paddingY={2} paddingX={1} className="scrollable-section">
            {applaudReceivedQuery.loading ? <Loader type={LOADER_TYPE.card}/> : renderApplauds(applaudReceivedQuery, false)}
          </Box>
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Given</Typography>
          <Box paddingY={2} paddingX={1} className="scrollable-section">
            {applaudGivenQuery.loading ? <Loader type={LOADER_TYPE.card}/> : renderApplauds(applaudGivenQuery, true)}
          </Box>
        </Grid>
        <Grid xs={4} item>
          <Typography align="center">Applaud Stream</Typography>
          <Box paddingY={2} paddingX={1} className="scrollable-section">
            {applaudStreamQuery.loading ? <Loader type={LOADER_TYPE.card}/> : renderApplauds(applaudStreamQuery, true)}
          </Box>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Dashboard;
