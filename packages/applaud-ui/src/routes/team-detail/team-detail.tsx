import React from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@material-ui/core";
import { faPeopleCarry, faList } from "@fortawesome/free-solid-svg-icons";
import PageLayout from "../../components/page-layout";
import PaperBox from "../../components/paper-box";
import { useTeamDetailQuery } from "../../generated/graphql";
import NoDataDetailsCard from "../../components/no-data-details-card";
import AppIcon from "../../components/app-icon";
import TeamDepartment from "./team-department";

export default function TeamDetail() {
  const { id } = useParams();

  const queryResult = useTeamDetailQuery({
    variables: {
      id: parseInt(id ?? "0", 10)
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  if (queryResult.error) {
    return <NoDataDetailsCard isError error={queryResult.error} />;
  }
  if (queryResult.loading) {
    return <NoDataDetailsCard isLoading />;
  }
  if (!queryResult || !queryResult.data || !queryResult.data.team) {
    return <NoDataDetailsCard />;
  }

  function renderTeamDetail() {
    return (
      <Grid item xs={12} sm container>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AppIcon icon={faPeopleCarry} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText secondary="Name">
              {queryResult?.data?.team?.name}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AppIcon icon={faList} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText secondary="Description">
              {queryResult?.data?.team?.description}
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    );
  }

  function renderDepartment() {
    return (
      <TeamDepartment
        queryResult={queryResult}
        teamId={parseInt(id ?? "0", 10)}
      />
    );
  }

  return (
    <PageLayout pageTitle="Team Details">
      <PaperBox>
        {renderTeamDetail()}
        {renderDepartment()}
      </PaperBox>
    </PageLayout>
  );
}
