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
import {
  useDepartmentQuery,
  useUpdateDepartmentMutation
} from "../../generated/graphql";
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
import { openSnackbar } from "../../components/notifier";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

interface Props {
  departmentId: number;
  open: boolean;
  onClose: (id?: number) => void;
}

function UpdateDepartmentDialog(props: Props) {
  const { open, onClose, departmentId } = props;

  const { data, loading } = useDepartmentQuery({
    variables: {
      id: departmentId
    },
    skip: !departmentId,
    fetchPolicy: "network-only"
  });
  const [
    updateDepartment,
    { loading: updateLoading }
  ] = useUpdateDepartmentMutation();

  const [{ name, description }, setDepartment] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      name: data?.department?.name ?? "",
      description: data?.department?.description ?? ""
    }
  );

  useEffect(() => {
    if (data?.department?.name) {
      setDepartment({ name: data.department.name });
    }
    if (data?.department?.description) {
      setDepartment({ description: data.department.description });
    }
  }, [data]);

  async function handleUpdate() {
    const response = await updateDepartment({
      variables: {
        input: {
          departmentId,
          name,
          description
        }
      }
    });

    if (response?.data?.updateDepartment?.department) {
      openSnackbar({ message: "Department updated successfully" }, "success");
      onClose(response.data.updateDepartment.department.id);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setDepartment({ [key]: value });
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>Update Department</DialogTitle>
      <DialogContent>
        {loading && <Loader type={LOADER_TYPE.content} />}
        {!loading && (
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
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!name || !description || updateLoading}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Update Department
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateDepartmentDialog;
