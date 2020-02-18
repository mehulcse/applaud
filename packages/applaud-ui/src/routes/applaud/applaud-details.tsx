import React from "react";
import PaperBox from "../../components/paper-box";
import { TextField } from "@material-ui/core";

function ApplaudDetails() {
    return (
        <PaperBox>
            <form className="applaud-details" noValidate autoComplete="off">
                <TextField label="To" />
                <TextField label="Message" multiline/>
            </form>
        </PaperBox>
    );
}

export default ApplaudDetails;