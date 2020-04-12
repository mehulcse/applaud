import React, {useState} from "react";
import {Grid, TextField, Button, Box} from "@material-ui/core";
import { useHistory } from "react-router";
import PaperBox from "../../components/paper-box";
import {
  useCreateFeedbackMutation,
} from "../../generated/graphql";
import {openSnackbar} from "../../components/notifier";
import theme from "../../core/mui-theme";
import Loader from "../../components/loader";
import {LOADER_TYPE} from "../../constants/constants";

function FeedbackForm() {
  const history = useHistory();
  const [feedback, setFeedback] = useState();
  const [createFeedback, createFeedbackResult] = useCreateFeedbackMutation();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  }

  async function onSend() {
    if (!feedback) {
      return;
    }
    const response = await createFeedback({
      variables: {
        input: {
          feedback
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
            message: "Error in submitting feedback."
          },
          "error"
        );
      }
      return error;
    });

    if (response?.data?.createFeedback?.feedback?.id) {
      openSnackbar(
        {
          message: "Thank you for your valuable feedback."
        },
        "success"
      );
      history.push("/dashboard")
    }
  }

  return (
    <PaperBox>
      <Box m={4}>
        <Grid container spacing={0} xs={12} justify="center">
          <Grid xs={12} item>
            <TextField
              value={feedback}
              onChange={onChange}
              label="Submit Feedback"
              placeholder="Add your suggestion,feedback or bug-fix request"
              fullWidth
              multiline={true}
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={0} xs={12} justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            style={{marginTop: theme.spacing(2)}}
            onClick={onSend}
            disabled={!feedback}
          >
            Send
          </Button>
        </Grid>
      </Box>
      {createFeedbackResult.loading && (
        <Loader type={LOADER_TYPE.fullView}/>
      )}
    </PaperBox>
  );
}

export default FeedbackForm;
