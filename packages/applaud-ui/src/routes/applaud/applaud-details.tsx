import React from "react";
import PaperBox from "../../components/paper-box";
import { Grid, TextField, Button, Box } from "@material-ui/core";

function ApplaudDetails() {
  return (
    <Grid xs={6}>
      <PaperBox>
        <form className="applaud-details" noValidate autoComplete="off">
          <TextField label="To" fullWidth required />
          <TextField label="Message" multiline fullWidth required rows="2" />
          <Box marginY={2}>
            <Button variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </form>
      </PaperBox>
    </Grid>
  );
}

export default ApplaudDetails;
