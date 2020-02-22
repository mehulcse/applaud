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
import { useCreateDepartmentMutation } from "../../generated/graphql";
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
import { openSnackbar } from "../../components/notifier";

interface Props {
  open: boolean;
  onClose: (id?: number) => void;
}

function AddDepartmentDialog(props: Props) {
  const { open, onClose } = props;

  const [createDepartment, { loading }] = useCreateDepartmentMutation();

  const [{ name, description }, setDepartment] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      name: "",
      description: ""
    }
  );

  async function handleCreate() {
    const response = await createDepartment({
      variables: {
        input: {
          name,
          description
        }
      }
    });

    if (response?.data?.createDepartment?.department) {
      openSnackbar({ message: "Department created successfully" }, "success");
      onClose(response.data.createDepartment.department.id);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setDepartment({ [key]: value });
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>New Department</DialogTitle>
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
            disabled={!name || !description || loading}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Add Department
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default AddDepartmentDialog;
