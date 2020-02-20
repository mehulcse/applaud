import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  Button,
  Typography
} from "@material-ui/core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useUsersQuery } from "../../generated/graphql";
import UsersTable from "./users-table";
import { SearchInput } from "../../components/search-input";
import AppIcon from "../../components/app-icon";
import { PAGE_LIMIT } from "../../constants/constants";
import PaperBox from "../../components/paper-box";
import PageLayout from "../../components/page-layout";
import AddUserDialog from "./add-user-dialog";
import UpdateUserDialog from "./update-user-dialog";

export default function Users() {
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUserId, setEditUserId] = useState(0);

  const queryResult = useUsersQuery({
    variables: {
      search,
      limit: PAGE_LIMIT,
      offset: 0
    },
    fetchPolicy: "network-only"
  });

  function onChange(value: string) {
    setSearch(value);
  }

  function handleAddUser() {
    setShowAddUser(true);
  }

  function closeDialog(id?: number) {
    setShowAddUser(false);
    if (id) {
      queryResult.refetch();
    }
  }

  function onEdit(userId: number) {
    setEditUserId(userId);
  }

  function updateCloseDialog(id?: number) {
    setEditUserId(0);
    if (id) {
      queryResult.refetch();
    }
  }

  return (
    <PageLayout pageTitle="Users">
      <PaperBox>
        <Box marginY={2}>
          <Button color="primary" onClick={handleAddUser} variant="outlined">
            <AppIcon icon={faPlus} standardRightMargin />
            Add User
          </Button>
        </Box>
        <Box marginY={2}>
          <Grid container>
            <Grid container xs={6} item>
              <SearchInput
                inputValue={search}
                placeholder="Search User"
                onChange={onChange}
              />
            </Grid>
          </Grid>
        </Box>
        <Box marginY={2}>
          <UsersTable queryResult={queryResult} onEditClick={onEdit} />
        </Box>
        <AddUserDialog open={showAddUser} onClose={closeDialog} />
        <UpdateUserDialog
          userId={editUserId}
          open={Boolean(editUserId)}
          onClose={updateCloseDialog}
        />
      </PaperBox>
    </PageLayout>
  );
}
