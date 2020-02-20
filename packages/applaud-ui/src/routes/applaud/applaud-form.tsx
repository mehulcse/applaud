import React from "react";
import PaperBox from "../../components/paper-box";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import {Grid, TextField, Button } from "@material-ui/core";
import CoinCounter from "./coin-counter";

function ApplaudForm() {
    return (
        <PaperBox>
            <form className="applaud-details" noValidate autoComplete="off">
                <Grid container spacing={3} xs={6}>
                    <Grid item xs={8}>
                        <CoinCounter count={1} />
                    </Grid>
                    <Grid item xs={12}>
                        <UserSelectorContainer label='To' onUsersSelected={() => console.log("hello")}  userIds={[1]}/>
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

export default ApplaudForm;