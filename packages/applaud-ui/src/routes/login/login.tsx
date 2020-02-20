import React, { useState, useContext, Fragment } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from "react-google-login";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// TODO: generate graphql
import { LoginUserComponent } from "../../generated/graphql";
import { AuthContext } from "../../core/auth-manager";
import AppIcon from "../../components/app-icon";
import LoginContainer from "../../components/login-container";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  orSeparator: {
    padding: theme.spacing(0, 2),
    background: theme.palette.common.white,
    position: "relative",
    top: "-11px"
  }
}));

export default function SignIn() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [shouldShowCodeInput, setShouldShowCodeInput] = useState(false);
  const [code, setCode] = useState("");

  const authContext = useContext(AuthContext);

  return (
    <LoginUserComponent>
      {loginUserMutation => (
        <LoginContainer>
          <>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form className={classes.form} noValidate>
              {!shouldShowCodeInput && (
                <Fragment>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    className={classes.submit}
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submit}
                    onClick={async () => {
                      const response = await loginUserMutation({
                        variables: {
                          input: {
                            email
                          }
                        }
                      });
                      if (response && response.data) {
                        setShouldShowCodeInput(true);
                      }
                    }}
                  >
                    Continue with Email
                  </Button>
                </Fragment>
              )}
              {shouldShowCodeInput && (
                <Fragment>
                  <TextField
                    label="Temporary Login Code"
                    variant="outlined"
                    fullWidth
                    value={code}
                    className={classes.submit}
                    onChange={e => {
                      setCode(e.target.value);
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submit}
                    onClick={async () => {
                      const response = await loginUserMutation({
                        variables: {
                          input: {
                            email,
                            temporaryLoginCode: code
                          }
                        }
                      });
                      if (
                        response &&
                        response.data &&
                        response.data.loginUser &&
                        response.data.loginUser.isLoggedIn === true
                      ) {
                        await authContext.refresh();
                      }
                    }}
                  >
                    Continue with Temporary Login Code
                  </Button>
                </Fragment>
              )}
              <Box
                mt={3}
                mx={1}
                borderTop={1}
                justifyContent="center"
                display="flex"
                borderColor="grey.500"
              >
                <i className={classes.orSeparator}>or</i>
              </Box>
              <GoogleLogin
                clientId="450135790724-l1l0tjjo65m6c78mlf3lvv1qub9he9lv.apps.googleusercontent.com"
                render={(renderProps: any) => (
                  <Button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    fullWidth
                    color="primary"
                    variant="contained"
                    className={classes.submit}
                  >
                    <AppIcon icon={faGoogle} wideRightMargin /> Login with
                    Google
                  </Button>
                )}
                onSuccess={async response => {
                  const offlineRes = response as GoogleLoginResponseOffline;
                  if (offlineRes.code) {
                    console.log("offline");
                    return null;
                  }

                  const res = response as GoogleLoginResponse;
                  const result = await loginUserMutation({
                    variables: {
                      input: {
                        googleIdToken: res.getAuthResponse().id_token
                      }
                    }
                  });
                  await authContext.refresh();
                  // console.log("Success", { response, result });
                }}
                onFailure={err => {
                  console.error("Error", { err });
                }}
              />
            </form>
          </>
        </LoginContainer>
      )}
    </LoginUserComponent>
  );
}
