import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Grid, TextField, Button, Box, Typography } from "@material-ui/core";
import StarRatingComponent from "react-star-rating-component";
import PaperBox from "../../components/paper-box";
import { useCreateApplaudMutation } from "../../generated/graphql";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import StructureCard from "../../components/applaud-cards/structure-cards";
import "./applaud-form.css";
import aboveBeyond from "../../lotties/4999-rocket.json";
import ninjaAnimation from "../../lotties/6936-class-ninjas-floating-ninja.json";
import thankYou from "../../lotties/11405-thank-you.json";
import thumbsUp from "../../lotties/856-thumbs-up-grey-blue.json";
import congrats from "../../lotties/11272-party-popper.json";
import gladiator from "../../lotties/15634-orange-super-hero.json";
import { openSnackbar } from "../../components/notifier";
import { AuthContext } from "../../core/auth-manager";

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
  const history = useHistory();
  const context = useContext(AuthContext);
  const [userId, setUserId] = useState(0);
  const [cardId, setCardId] = useState("");
  const [clap, setClap] = useState();
  const [message, setMessage] = useState("");

  const [createApplaud, { loading }] = useCreateApplaudMutation();

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

  function onStartClick(nextValue: number) {
    if (!nextValue) {
      openSnackbar(
        {
          message: "Clap cannot be 0"
        },
        "error"
      );
    }
    setClap(nextValue);
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.trim();
    if (value.length > 250) {
      openSnackbar(
        {
          message: "Message cannot be greater than 250"
        },
        "error"
      );
      return;
    }
    setMessage(value);
  }

  async function onSend() {
    const response = await createApplaud({
      variables: {
        input: {
          type: cardId,
          balance: clap,
          allocatedToUserId: userId,
          allocatedByUserId: context?.user?.id ?? 0,
          message
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
            message: "Error Occurred in applaud"
          },
          "error"
        );
      }
      return error;
    });

    if (response?.data?.createApplaud?.applaud?.id) {
      openSnackbar(
        {
          message: "Your applaud received"
        },
        "success"
      );
      history.push("/dashboard");
    }
  }

  function onCancel() {
    history.push("/dashboard");
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
              <StarRatingComponent
                name="clap"
                value={clap}
                onStarClick={onStartClick}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={message}
              onChange={onMessageChange}
              label="Message"
              placeholder="Say nice things"
              multiline
              rows={4}
              rowsMax={4}
              fullWidth
              variant="outlined"
            />
            <Typography variant="caption">
              This textarea support markdown
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 5 }}
              onClick={onSend}
              disabled={!clap || !userId || !cardId || loading}
            >
              Send
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PaperBox>
  );
}

export default ApplaudForm;
