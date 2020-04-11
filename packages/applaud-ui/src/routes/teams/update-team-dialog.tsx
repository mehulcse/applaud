import React, { useEffect, useReducer } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button
} from "@material-ui/core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTeamQuery, useUpdateTeamMutation } from "../../generated/graphql";
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
import { openSnackbar } from "../../components/notifier";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

interface Props {
  teamId: number;
  open: boolean;
  onClose: (id?: number) => void;
}

function UpdateTeamDialog(props: Props) {
  const { open, onClose, teamId } = props;

  const { data, loading } = useTeamQuery({
    variables: {
      id: teamId
    },
    skip: !teamId,
    fetchPolicy: "network-only"
  });
  const [updateTeam, { loading: updateLoading }] = useUpdateTeamMutation();

  const [{ name, description }, setTeam] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      name: data?.team?.name ?? "",
      description: data?.team?.description ?? ""
    }
  );

  useEffect(() => {
    if (data?.team?.name) {
      setTeam({ name: data.team.name });
    }
    if (data?.team?.description) {
      setTeam({ description: data.team.description });
    }
  }, [data]);

  async function handleUpdate() {
    const response = await updateTeam({
      variables: {
        input: {
          teamId,
          name,
          description
        }
      }
    });

    if (response?.data?.updateTeam?.team) {
      openSnackbar({ message: "Team updated successfully" }, "success");
      onClose(response.data.updateTeam.team.id);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setTeam({ [key]: value });
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>Update Team</DialogTitle>
      <DialogContent>
        {(loading || updateLoading) && <Loader type={LOADER_TYPE.content} />}
        {!(loading || updateLoading) && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                id="name"
                name="name"
                fullWidth
                value={name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                id="description"
                name="description"
                fullWidth
                value={description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <ButtonList>
          <Button onClick={() => onClose()} disabled={loading || updateLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!name || !description || updateLoading || loading}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Update Team
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateTeamDialog;
