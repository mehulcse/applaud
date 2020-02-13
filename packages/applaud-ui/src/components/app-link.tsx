import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@material-ui/styles";
import { Link } from "@material-ui/core";

import theme from "../core/mui-theme";
// import { AppUpdateContext } from "../core/app-update-monitor";

const StyledA = styled(Link)({
  color: theme.palette.primary.dark,
  textDecoration: "none",

  "&:focus, &:hover, &:visited, &:link, &:active": {
    textDecoration: "none",
    color: theme.palette.primary.dark
  },

  "&:hover": {
    color: theme.palette.primary.main
  }
});

const StyledLink = styled(RouterLink)({
  color: theme.palette.primary.dark,
  textDecoration: "none",

  "&:focus, &:hover, &:visited, &:link, &:active": {
    textDecoration: "none",
    color: theme.palette.primary.dark
  },

  "&:hover": {
    color: theme.palette.primary.main
  }
});

/* AppLink is a wrapper adding custom styling to React Routers Link component */
class AppLink extends Component<any> {
  state = {};

  render() {
    const { to, children, ...rest } = this.props;
    const { isUpdateAvailable } = this.context;
    if (isUpdateAvailable) {
      return (
        <StyledA href={to} {...rest}>
          {children}
        </StyledA>
      );
    }
    return (
      <StyledLink to={to} {...rest}>
        {children}
      </StyledLink>
    );
  }
}

export const ButtonAppLink = (props: any) => <AppLink {...props} />;

export default AppLink;
