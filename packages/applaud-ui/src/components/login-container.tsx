import React, { Component } from "react";
import { styled } from "@material-ui/core/styles";
import { Grid, Paper, CssBaseline, Container } from "@material-ui/core";

import theme from "../core/mui-theme";

const StyledGrid = styled(Grid)({
  minHeight: "100vh"
});

const StyledPaper = styled(Paper)({
  padding: theme.spacing(2)
});

interface Props {
  children: React.ReactNode;
}

class LoginContainer extends Component<Props> {
  state = {};

  render() {
    const { children } = this.props;

    return (
      <Container component="main">
        <CssBaseline />
        <StyledGrid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid xs={10} sm={9} md={7} lg={6} item>
            <StyledPaper elevation={5}>{children}</StyledPaper>
          </Grid>
        </StyledGrid>
      </Container>
    );
  }
}

export default LoginContainer;
