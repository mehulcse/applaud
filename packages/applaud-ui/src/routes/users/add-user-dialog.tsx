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
import { useCreateUserMutation } from "../../generated/graphql";
import { ButtonList } from "../../components/button-list";
import AppIcon from "../../components/app-icon";
import { openSnackbar } from "../../components/notifier";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

interface Props {
  open: boolean;
  onClose: (id?: number) => void;
}

function AddUserDialog(props: Props) {
  const { open, onClose } = props;

  const [createUser, { loading }] = useCreateUserMutation();

  const [{ email, firstName, lastName }, setUser] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      firstName: "",
      lastName: "",
      email: ""
    }
  );

  async function handleCreate() {
    const response = await createUser({
      variables: {
        input: {
          firstName,
          lastName,
          email
        }
      }
    });
    if (response?.data?.createUser?.user) {
      openSnackbar({ message: "User created successfully" }, "success");
      onClose(response.data.createUser.user.id);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setUser({ [key]: value });
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>New User</DialogTitle>
      <DialogContent>
        {loading && <Loader type={LOADER_TYPE.content} />}
        {!loading && (
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
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <ButtonList>
          <Button onClick={() => onClose()} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={!email || !firstName || !lastName || loading}
          >
            <AppIcon icon={faCheck} standardRightMargin />
            Add User
          </Button>
        </ButtonList>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserDialog;
