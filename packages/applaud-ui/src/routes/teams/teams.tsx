import React, { useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTeamsQuery } from "../../generated/graphql";
import TeamsTable from "./teams-table";
import { SearchInput } from "../../components/search-input";
import AppIcon from "../../components/app-icon";
import PaperBox from "../../components/paper-box";
import PageLayout from "../../components/page-layout";
import AddTeamDialog from "./add-team-dialog";
import UpdateTeamDialog from "./update-team-dialog";
import { PAGE_LIMIT } from "../../constants/constants";

export default function Teams() {
  const [search, setSearch] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editTeamId, setEditTeamId] = useState(0);

  const queryResult = useTeamsQuery({
    variables: {
      search,
      limit: PAGE_LIMIT,
      offset: 0
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  function onChange(value: string) {
    setSearch(value);
  }

  function handleAddTeam() {
    setShowAddTeam(true);
  }

  function closeDialog(id?: number) {
    setShowAddTeam(false);
    if (id) {
      queryResult.refetch();
    }
  }

  function onEdit(teamId: number) {
    setEditTeamId(teamId);
  }

  function updateCloseDialog(id?: number) {
    setEditTeamId(0);
    if (id) {
      queryResult.refetch();
    }
  }

  return (
    <PageLayout pageTitle="Teams">
      <PaperBox>
        <Grid justify="space-between" container>
          <Grid item xs={6}>
            <Box marginY={2} display="flex">
              <SearchInput
                inputValue={search}
                placeholder="Search Team"
                onChange={onChange}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box marginY={2} display="flex">
              <Button
                color="primary"
                onClick={handleAddTeam}
                variant="outlined"
              >
                <AppIcon icon={faPlus} standardRightMargin />
                Add Team
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box marginY={2}>
          <TeamsTable queryResult={queryResult} onEditClick={onEdit} />
        </Box>
        <AddTeamDialog open={showAddTeam} onClose={closeDialog} />
        <UpdateTeamDialog
          teamId={editTeamId}
          open={Boolean(editTeamId)}
          onClose={updateCloseDialog}
        />
      </PaperBox>
    </PageLayout>
  );
}
