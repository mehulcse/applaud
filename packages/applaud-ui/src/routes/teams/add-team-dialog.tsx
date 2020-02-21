import React, { useReducer } from "react";
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
import { useCreateTeamMutation } from "../../generated/graphql";
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
import { openSnackbar } from "../../components/notifier";

interface Props {
  open: boolean;
  onClose: (id?: number) => void;
}

function AddTeamDialog(props: Props) {
  const { open, onClose } = props;

  const [createTeam, { loading }] = useCreateTeamMutation();

  const [{ name, description }, setTeam] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      name: "",
      description: ""
    }
  );

  async function handleCreate() {
    const response = await createTeam({
      variables: {
        input: {
          name,
          description
        }
      }
    });

    if (response?.data?.createTeam?.team) {
      openSnackbar({ message: "Team created successfully" }, "success");
      onClose(response.data.createTeam.team.id);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setTeam({ [key]: value });
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>New Team</DialogTitle>
      <DialogContent>
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
              multiline
              value={description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonList>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={loading}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Add Team
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default AddTeamDialog;
