import React, {useContext, useState, useEffect} from "react";
import {Grid, TextField, Button, Typography, Box} from "@material-ui/core";
import PaperBox from "../../components/paper-box";
import {
  useUpdateCoinBalanceMutation,
  useConstantsQuery,
  useUpdateConstantsMutation
} from "../../generated/graphql";
import {openSnackbar} from "../../components/notifier";
import {AuthContext} from "../../core/auth-manager";
import theme from "../../core/mui-theme";
import Loader from "../../components/loader";
import {CONSTANTS, LOADER_TYPE, PAGE_LIMIT} from "../../constants/constants";

function ManageForm() {
  const context = useContext(AuthContext);
  const [quantity, setQuantity] = useState();
  const [teamMultiplier, setTeamMultiplier] = useState();
  const [updateCoins, updateCoinsResult] = useUpdateCoinBalanceMutation();
  const [updateConstants, updateConstantsResult] = useUpdateConstantsMutation();
  const {data, loading, refetch} = useConstantsQuery({
    variables: {
      limit: PAGE_LIMIT,
      offset: 0
    },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    const teamMultiplierObj = getTeamMultiplier();
    const teamMultiplierValue = teamMultiplierObj?.value ?? 0;
    setTeamMultiplier(teamMultiplierValue);
  }, [data]);

  const getTeamMultiplier = () => {
    if (data?.constants?.nodes) {
      return data.constants.nodes.find(
        constant => constant.name === CONSTANTS.TEAM_MULTIPLIER
      );
    }
    return {
      value: 0,
      id: 0
    };
  };

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value && parseInt(event.target.value, 10) >= 0 ? parseInt(event.target.value, 10) : null;
    setQuantity(value);
  }

  function onMultiplierChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value && parseInt(event.target.value, 10) > 0 ? parseInt(event.target.value, 10) : null;
    setTeamMultiplier(value);
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

  async function onSave() {
    const teamMultiplierObj = getTeamMultiplier();
    if (!teamMultiplierObj) {
      return;
    }
    const response = await updateConstants({
      variables: {
        input: {
          constantId: teamMultiplierObj.id,
          value: String(teamMultiplier)
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
            message: "Error in updating Team Multiplier."
          },
          "error"
        );
      }
      return error;
    });

    if (response?.data?.updateConstants?.constant) {
      openSnackbar(
        {
          message: "Team Multiplier Updated"
        },
        "success"
      );
      refetch();
    }
  }

  return (
    <PaperBox>
      <Box m={4}>
        <Grid container spacing={0} xs={12} justify="space-between">
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
      </Box>
      <Box m={4}>
        <Grid container spacing={0} xs={12} justify="space-between">
          <Grid xs={8} item>
            <TextField
              value={teamMultiplier}
              onChange={onMultiplierChange}
              label="Inter Team Multiplier"
              type="number"
              fullWidth
              variant="outlined"
            />
            <Typography variant="caption">
              The Total claps received by an employee from other teams will be
              multiplied by this number
            </Typography>
          </Grid>
          <Grid xs={2} item>
            <Button
              variant="contained"
              color="primary"
              style={{marginRight: theme.spacing(1)}}
              onClick={onSave}
              disabled={!teamMultiplier}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
      {(loading ||
        updateCoinsResult.loading ||
        updateConstantsResult.loading) && (
        <Loader type={LOADER_TYPE.fullView}/>
      )}
    </PaperBox>
  );
}

export default ManageForm;
