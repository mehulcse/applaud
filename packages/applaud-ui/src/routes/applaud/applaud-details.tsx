import React from "react";
import PaperBox from "../../components/paper-box";
import {Grid, TextField, Button, Box } from "@material-ui/core";

function ApplaudDetails() {
    return (
        <PaperBox>
            <form className="applaud-details" noValidate autoComplete="off">
                <Grid container spacing={3} xs={6}>
                    <Grid item xs={12}>
                        <TextField
                            label="To"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Message"
                            multiline
                            fullWidth
                            required
                            rows="2"
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </PaperBox>
    );
}

export default ApplaudDetails;