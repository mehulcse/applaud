import React from "react";
import PaperBox from "../../components/paper-box";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import CoinCounter from "./coin-counter";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import StructureCard from "../../components/applaud-cards/structure-cards";
import "./applaud-form.css";
import aboveBeyond from "../../lotties/4999-rocket.json";
import ninjaAnimation from "../../lotties/6936-class-ninjas-floating-ninja.json";
import thankYou from "../../lotties/11405-thank-you.json";
import thumbsUp from "../../lotties/856-thumbs-up-grey-blue.json";
import congrats from "../../lotties/11272-party-popper.json";
import gladiator from "../../lotties/15634-orange-super-hero.json";
import MessageEditor from "../../components/messageBox/MessageEditor";
import CardPreview from "../../components/card-preview/card-preview";

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

function ApplaudForm() {
  return (
    <PaperBox>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <section className="cardsWrapper">
            <section className="card-tiles-details">
              {applaudCardData.map(item => {
                return <StructureCard key={item.id} data={item} />;
              })}
            </section>
          </section>
          <form className="applaud-details" noValidate autoComplete="off">
            <Grid>
              <Grid>
                <UserSelectorContainer
                  label="To"
                  onUsersSelected={() => console.log("hello")}
                  userIds={[]}
                />
              </Grid>
              <Grid>
                <MessageEditor
                  onValueChange={() => {
                    console.log("hello");
                  }}
                  content={"1"}
                />
              </Grid>
              <Grid container spacing={3} item xs={6}>
                <Grid item xs={8}>
                  <CoinCounter count={1} />
                </Grid>
              </Grid>
              <Grid>
                <Button variant="contained" color="primary">
                  Send
                </Button>
                <Button variant="contained" color="secondary">
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={3}>
          <CardPreview />
        </Grid>
      </Grid>
    </PaperBox>
  );
}

export default ApplaudForm;
