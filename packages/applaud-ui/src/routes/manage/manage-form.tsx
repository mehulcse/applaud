import React, {useContext, useState} from "react";
import {Grid, TextField, Button, Typography} from "@material-ui/core";
import PaperBox from "../../components/paper-box";
import {useUpdateCoinBalanceMutation} from "../../generated/graphql";
import {openSnackbar} from "../../components/notifier";
import {AuthContext} from "../../core/auth-manager";
import theme from "../../core/mui-theme";
import Loader from "../../components/loader";
import {LOADER_TYPE} from "../../constants/constants";

function ManageForm() {
  const context = useContext(AuthContext);
  const [quantity, setQuantity] = useState();
  const [updateCoins, {loading}] = useUpdateCoinBalanceMutation();
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value ? parseInt(event.target.value, 10) : null;
    setQuantity(value);
  }

  async function onSend() {
    const response = await updateCoins({
      variables: {
        input: {
          quantity
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
            message: "Error in updating Claps."
          },
          "error"
        );
      }
      return error;
    });

    if (response?.data?.updateCoinBalance?.success) {
      openSnackbar(
        {
          message: "Claps Updated"
        },
        "success"
      );
      context.refresh();
    }
  }

  return (
    <PaperBox>
      <Grid
        container
        spacing={0}
        xs={12}
        justify="space-between"
        style={{minHeight: "70vh"}}
      >
        <Grid xs={8} item>
          <TextField
            value={quantity}
            onChange={onChange}
            label="Allocate Claps"
            placeholder="Number of claps"
            type="number"
            fullWidth
            variant="outlined"
          />
          <Typography variant="caption">
            This will reset value of claps for all user.
          </Typography>
        </Grid>
        <Grid xs={2} item>
          <Button
            variant="contained"
            color="primary"
            style={{marginRight: theme.spacing(1)}}
            onClick={onSend}
            disabled={!quantity}
          >
            Allocate
          </Button>
        </Grid>
      </Grid>
      {loading && <Loader type={LOADER_TYPE.fullView} />}
    </PaperBox>
  );
}

export default ManageForm;
