import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import StarRatingComponent from "react-star-ratings";
import PaperBox from "../../components/paper-box";
import { useCreateApplaudMutation } from "../../generated/graphql";
import UserSelectorContainer from "../../components/user-selector/user-selector";
import StructureCard from "../../components/applaud-cards/structure-cards";
import "./applaud-form.css";
import aboveBeyond from "../../lotties/4999-rocket.json";
import ninjaAnimation from "../../lotties/6936-class-ninjas-floating-ninja.json";
import thankYou from "../../lotties/11405-thank-you.json";
import thumbsUp from "../../lotties/well_done.json";
import congrats from "../../lotties/11272-party-popper.json";
import gladiator from "../../lotties/15634-orange-super-hero.json";
import { openSnackbar } from "../../components/notifier";
import { AuthContext } from "../../core/auth-manager";
import theme from "../../core/mui-theme";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

export const applaudCardData = [
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

  function changeRating(clap: number) {
    if (!clap) {
      openSnackbar(
        {
          message: "Clap cannot be 0"
        },
        "error"
      );
    }
    setClap(clap);
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
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
    if (
      !context?.coinBalance?.balance ||
      (context?.coinBalance?.balance && context.coinBalance.balance < clap)
    ) {
      openSnackbar(
        {
          message: "You can't send claps as you don't have sufficient balance"
        },
        "error"
      );
      return;
    }
    if (context?.user?.id) {
      if (context.user.id === userId) {
        openSnackbar(
          {
            message: "Nice Try! You can't send yourself clap!!"
          },
          "error"
        );
      }
    }
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
          message: "Your applaud has been received."
        },
        "success"
      );
      context.refresh();
      history.push("/dashboard");
    }
    // }
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
        <Grid container item xs={10} spacing={2}>
          <Grid item xs={12}>
            <UserSelectorContainer
              label="To"
              onUsersSelected={onUserSelected}
              userIds={userId ? [userId] : []}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid style={{ marginBottom: theme.spacing(1) }}>
              <Typography variant="subtitle1">Card:</Typography>
            </Grid>
            <section className="cardsWrapper">
              <section className="card-tiles-details">
                <Grid container spacing={3}>
                  {applaudCardData.map(item => {
                    return (
                      <Grid item xs={4} key={item.id}>
                        <StructureCard
                          key={item.id}
                          data={item}
                          onClick={onCardClick.bind(null, item.id)}
                          selected={cardId === item.id}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </section>
            </section>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={8}>
              <Typography variant="subtitle1">Clap:</Typography>
              <StarRatingComponent
                name="clap"
                rating={clap}
                changeRating={changeRating}
                starRatedColor="#3FBEEE"
                starHoverColor="#3FBEEE"
                starEmptyColor={theme.palette.common.white}
                svgIconPath="M91.434 483.987c-.307-16.018 13.109-29.129 29.13-29.129h62.293v-5.714H56.993c-16.021 0-29.437-13.111-29.13-29.129C28.16 404.491 40.835 392 56.428 392h126.429v-5.714H29.136c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h154.286v-5.714H57.707c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h168.566l-31.085-22.606c-12.762-9.281-15.583-27.149-6.302-39.912 9.281-12.761 27.15-15.582 39.912-6.302l123.361 89.715a34.287 34.287 0 0 1 14.12 27.728v141.136c0 15.91-10.946 29.73-26.433 33.374l-80.471 18.934a137.16 137.16 0 0 1-31.411 3.646H120c-15.593-.001-28.269-12.492-28.566-28.014zm73.249-225.701h36.423l-11.187-8.136c-18.579-13.511-20.313-40.887-3.17-56.536l-13.004-16.7c-9.843-12.641-28.43-15.171-40.88-5.088-12.065 9.771-14.133 27.447-4.553 39.75l36.371 46.71zm283.298-2.103l-5.003-152.452c-.518-15.771-13.722-28.136-29.493-27.619-15.773.518-28.137 13.722-27.619 29.493l1.262 38.415L283.565 11.019c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l76.889 98.745-4.509 3.511-94.79-121.734c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l94.443 121.288-4.509 3.511-77.675-99.754c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l52.053 66.849c12.497-8.257 29.055-8.285 41.69.904l123.36 89.714c10.904 7.93 17.415 20.715 17.415 34.198v16.999l61.064-47.549a34.285 34.285 0 0 0 13.202-28.177z"
                svgIconViewBox="0 0 448 512"
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
              style={{ marginRight: theme.spacing(1) }}
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
      {loading && <Loader type={LOADER_TYPE.fullView} />}
    </PaperBox>
  );
}

export default ApplaudForm;
