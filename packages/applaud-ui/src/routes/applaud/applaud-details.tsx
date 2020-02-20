import React from "react";
import PaperBox from "../../components/paper-box";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import StructureCard from "../../components/ApplaudCards/StructureCards";
import "./applaud-form.css";
import aboveBeyond from "../../lotties/4999-rocket.json";
import ninjaAnimation from "../../lotties/6936-class-ninjas-floating-ninja.json";
import thankYou from "../../lotties/11405-thank-you.json";
import thumbsUp from "../../lotties/856-thumbs-up-grey-blue.json";
import congrats from "../../lotties/11272-party-popper.json";
import gladiator from "../../lotties/15634-orange-super-hero.json";
import MessageEditor from "../../components/messageBox/MessageEditor";

const applaudCardData = [
  {
    header: "Above and Beyond",
    animation: aboveBeyond,
    id: "aboveBeyond"
  },
  {
    header: "Ninja",
    animation: ninjaAnimation,
    id: "ninja"
  },
  {
    header: "Thank You",
    animation: thankYou,
    id: "thankYou"
  },
  {
    header: "Gladiator",
    animation: gladiator,
    id: "gladiator"
  },
  {
    header: "Congratulations",
    animation: congrats,
    id: "congrats"
  },
  {
    header: "Well Done",
    animation: thumbsUp,
    id: "wellDone"
  }
];
function ApplaudDetails() {
  return (
    <Grid xs={12}>
      <PaperBox>
        <section className="cardsWrapper">
          <section className="card-tiles-details">
            {applaudCardData.map(item => {
              return <StructureCard key={item.id} data={item} />;
            })}
          </section>
          <section className="preview">
            <section className="card-preview"></section>
            <section className="message-preview"></section>
          </section>
        </section>
        <form className="applaud-details" noValidate autoComplete="off">
          <MessageEditor
            onValueChange={() => {
              console.log("hello");
            }}
            content={"1"}
          />
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
