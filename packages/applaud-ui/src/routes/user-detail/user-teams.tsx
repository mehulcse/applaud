import React, { useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  useCreateUserTeamMutation,
  useDeleteUserTeamMutation,
  UserDetailQueryResult
} from "../../generated/graphql";
import AppIcon from "../../components/app-icon";
import TeamSelectorContainer from "../../components/team-selector/team-selector";
import theme from "../../core/mui-theme";
import { openSnackbar } from "../../components/notifier";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

interface Props {
  queryResult: UserDetailQueryResult;
  userId: number;
}

export default function UserTeams(props: Props) {
  const { queryResult, userId } = props;
  const teams = queryResult?.data?.user?.teams ?? [];

  const [teamId, setTeamId] = useState<number>(0);

  const [
    deleteUserTeam,
    { loading: deleteLoading }
  ] = useDeleteUserTeamMutation();

  const [
    createUserTeam,
    { loading: createLoading }
  ] = useCreateUserTeamMutation();

  async function onDelete(teamId: number) {
    if (userId && teamId) {
      const response = await deleteUserTeam({
        variables: {
          input: {
            userId,
            teamId
          }
        }
      }).catch(error => {
        if (error?.message) {
          openSnackbar(
            {
              message: error.message
            },
            "error"
          );
        } else {
          openSnackbar(
            {
              message: "Error occurred while deleting team from user"
            },
            "error"
          );
        }
        return error;
      });

      if (response?.data?.deleteUserTeam?.isDeleted) {
        openSnackbar(
          {
            message: "Team deleted from user successfully"
          },
          "success"
        );
        queryResult.refetch();
      }
    } else {
      openSnackbar(
        {
          message: "Please provide team"
        },
        "error"
      );
    }
  }

  async function onAdd() {
    if (userId && teamId) {
      const response = await createUserTeam({
        variables: {
          input: {
            userId,
            teamId
          }
        }
      }).catch(error => {
        if (error?.message) {
          openSnackbar(
            {
              message: error.message
            },
            "error"
          );
        } else {
          openSnackbar(
            {
              message: "Error occurred while adding team to user"
            },
            "error"
          );
        }
        return error;
      });

      if (response?.data?.createUserTeam?.userTeam?.id) {
        openSnackbar(
          {
            message: "Team added to user successfully"
          },
          "success"
        );
        setTeamId(0);
        queryResult.refetch();
      }
    } else {
      openSnackbar(
        {
          message: "Please provide team"
        },
        "error"
      );
    }
  }

  function onTeamsSelected(teamIds: number[]) {
    if (teamIds.length) {
      setTeamId(teamIds[0]);
    } else {
      setTeamId(0);
    }
  }

  return (
    <Grid container>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Teams
        </Typography>
      </Grid>
      <Grid container>
        <List component="ul" id="teams">
          {teams.map((team: any) => (
            <ListItem>
              <ListItemText style={{ marginRight: theme.spacing(1) }}>
                {team.name}
              </ListItemText>
              <ListItemIcon style={{ cursor: "pointer" }}>
                <AppIcon
                  icon={faTimes}
                  onClick={onDelete.bind(null, team.id)}
                />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <TeamSelectorContainer
            label="Team"
            teamIds={teamId ? [teamId] : []}
            onTeamsSelected={onTeamsSelected}
            placeholder="Select Team"
          />
        </Grid>
        <Grid item style={{ padding: theme.spacing(4), cursor: "pointer" }}>
          <AppIcon icon={faPlus} onClick={onAdd} size="lg" />
        </Grid>
      </Grid>
      {(deleteLoading || createLoading) && (
        <Loader type={LOADER_TYPE.fullView} />
      )}
    </Grid>
  );
}
