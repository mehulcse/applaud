import React from "react";
import PaperBox from "../../components/paper-box";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import {Grid, TextField, Button, Box } from "@material-ui/core";

function ApplaudDetails() {
    return (
        <PaperBox>
            <form className="applaud-details" noValidate autoComplete="off">
                <Grid container spacing={3} xs={6}>
                    <Grid item xs={12}>
                        <UserSelectorContainer placeholder='To' label='To' onUsersSelected={() => console.log("hello")}  userIds={[1]}/>
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