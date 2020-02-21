import React, { useState } from "react";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import PaperBox from "../../components/paper-box";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import CoinCounter from "./coin-counter";
import StructureCard from "../../components/applaud-cards/structure-cards";
import "./applaud-form.css";
import aboveBeyond from "../../lotties/4999-rocket.json";
import ninjaAnimation from "../../lotties/6936-class-ninjas-floating-ninja.json";
import thankYou from "../../lotties/11405-thank-you.json";
import thumbsUp from "../../lotties/856-thumbs-up-grey-blue.json";
import congrats from "../../lotties/11272-party-popper.json";
import gladiator from "../../lotties/15634-orange-super-hero.json";
import MessageEditor from "../../components/messageBox/MessageEditor";
import { openSnackbar } from "../../components/notifier";

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
  const [userId, setUserId] = useState(0);
  const [cardId, setCardId] = useState("");
  const [clap, setClap] = useState();
  const [message, setMessage] = useState("");

  function onCardClick(cardId: string) {
    setCardId(cardId);
  }

  function onUserSelected(userIds: number[]) {
    if (userIds.length) {
      setUserId(userIds[0]);
    } else {
      setUserId(0);
    }
  }

  function onMessageChange(text: string) {
    if (text.trim().length > 250) {
      openSnackbar(
        {
          message: "Message cannot be greater than 250"
        },
        "error"
      );
      return;
    }
    setMessage(text);
  }

  return (
    <PaperBox>
      <Grid
        container
        spacing={0}
        justify="center"
        style={{ minHeight: "70vh" }}
      >
        <Grid container item xs={10}>
          <Grid item xs={12}>
            <UserSelectorContainer
              label="To"
              onUsersSelected={onUserSelected}
              userIds={userId ? [userId] : []}
            />
          </Grid>
          <Grid item xs={12}>
            <section className="cardsWrapper">
              <section className="card-tiles-details">
                {applaudCardData.map(item => {
                  return (
                    <StructureCard
                      key={item.id}
                      data={item}
                      onClick={onCardClick.bind(null, item.id)}
                      selected={cardId === item.id}
                    />
                  );
                })}
              </section>
            </section>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={8}>
              <CoinCounter count={1} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <MessageEditor onValueChange={onMessageChange} content={message} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Send
            </Button>
            <Button variant="contained" color="secondary">
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PaperBox>
  );
}

export default ApplaudForm;
