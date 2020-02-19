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
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
// import { openSnackbar } from "../../components/notifier";

interface Props {
  userId: number;
  open: boolean;
  onClose: () => void;
}

function UpdateUserDialog(props: Props) {
  const { open, onClose, userId } = props;

  // TODO: generate graphql
  // const {data, loading} = useUserQuery({
  //   variables: {
  //     id: userId
  //   },
    // fetchPolicy: "network-only"
  //})
  // const [updateUser, {loading}] = useUpdateUserMutation();

  const [{email, firstName, lastName, teamId, departmentId}, setUser] = useReducer(
    (state: any, newState: any) => ({...state, ...newState}),
    {
      firstName: "",
      lastName: "",
      email: "",
      teamId: 0,
      departmentId: 0
    }
  );

  async function handleUpdate() {
    // const response = await updateUser({
    //   variables: {
    //     input: {
    //       id: userId,
    //       firstName,
    //       lastName,
    //       email,
    //       teamId,
    //       departmentId
    //     }
    //   }
    // });

    // if (response?.data?.updateUser?.user) {
    //   openSnackbar({ message: "User updated successfully" }, "success");
    //   onClose();
    // }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setUser({[key]: value});
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              id="first-name"
              name="firstName"
              fullWidth
              value={firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              id="last-name"
              name="lastName"
              fullWidth
              value={lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              id="email"
              name="email"
              fullWidth
              value={email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            {/*  TODO: add department selection box */}
          </Grid>
          <Grid item xs={12}>
            {/*  TODO: add team selection box */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonList>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Update User
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateUserDialog;