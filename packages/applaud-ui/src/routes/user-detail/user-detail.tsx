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
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import PageLayout from "../../components/page-layout";
import PaperBox from "../../components/paper-box";
import { useUserDetailQuery } from "../../generated/graphql";
import NoDataDetailsCard from "../../components/no-data-details-card";
import AppIcon from "../../components/app-icon";
import UserTeams from "./user-teams";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

export default function UserDetail() {
  const { id } = useParams();

  const queryResult = useUserDetailQuery({
    variables: {
      id: parseInt(id ?? "0", 10)
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  if (!queryResult.loading && queryResult.error) {
    return <NoDataDetailsCard isError error={queryResult.error} />;
  }
  if (
    !queryResult ||
    (!queryResult.loading && (!queryResult.data || !queryResult.data.user))
  ) {
    return <NoDataDetailsCard />;
  }

  function renderUserDetail() {
    return (
      <Grid item xs={12} sm container>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AppIcon icon={faUser} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText secondary="Name">
              {queryResult?.data?.user?.fullName}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AppIcon icon={faEnvelope} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText secondary="Email">
              {queryResult?.data?.user?.email}
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    );
  }

  function renderTeams() {
    return (
      <UserTeams queryResult={queryResult} userId={parseInt(id ?? "0", 10)} />
    );
  }

  return (
    <PageLayout pageTitle="User Details">
      <PaperBox>
        {renderUserDetail()}
        {renderTeams()}
        {queryResult.loading && <Loader type={LOADER_TYPE.fullView} />}
      </PaperBox>
    </PageLayout>
  );
}
