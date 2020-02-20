import React, { Component } from "react";
import { styled, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MainMenu from "./main-menu/main-menu";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  MenuItem,
  Menu
} from "@material-ui/core";
import { MenuProps } from "@material-ui/core/Menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import theme from "../core/mui-theme";
import { Link } from "react-router-dom";
import AppLink from "./app-link";
import AppIcon from "../components/app-icon";
import { AuthContext } from "../core/auth-manager";
import { AuthContextValue } from "../core/auth-manager/auth-manager";

const drawerWidth = 250;

const StyledAppBar = styled(AppBar)({
  boxshadow: "none",
  position: "fixed"
});

const StyledToolbar = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 8px",
  ...theme.mixins.toolbar
});

const StyledMain = styled(Box)({
  flexGrow: 1,
  overflowY: "auto"
});

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})((props: MenuProps) => (
  <Menu
    getContentAnchorEl={null}
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    {...props}
  />
));

interface Props {
  children: React.ReactNode;
  pageTitle?: string;
  appBarContent?: React.ReactNode | null;
}

interface State {
  openEl: HTMLElement | null;
}

class PageLayout extends Component<Props, State> {
  static contextType = AuthContext;
  state = {
    openEl: null
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      openEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      openEl: null
    });
  };

  signOut = async () => {
    this.handleClose();
    (this.context as AuthContextValue).logout();
  };

  renderProfile() {
    const user = (this.context as AuthContextValue).user;
    // const userName = user ? `${user.firstName} ${user.lastName}` : "-";

    return (
      <List>
        <ListItem button>
          <ListItemAvatar>
            <Avatar>
              <AppIcon icon={faUser} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            aria-controls="user-menu"
            aria-haspopup="true"
            style={{ position: "relative" }}
            onClick={this.handleClick}
            secondary="Current User"
          >
            {/*<span title={userName}>{userName}</span>*/}
          </ListItemText>
          <StyledMenu
            id="user-menu"
            anchorEl={this.state.openEl}
            open={Boolean(this.state.openEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.signOut}>Sign out</MenuItem>
          </StyledMenu>
        </ListItem>
      </List>
    );
  }

  render() {
    const { children, pageTitle, appBarContent } = this.props;

    return (
      <Box component="div" display="flex" height="100vh" width="100%">
        <CssBaseline />
        <Box
          flexGrow={0}
          display="flex"
          flexDirection="column"
          borderRight="1px solid rgba(0, 0, 0, 0.12)"
          bgcolor="#FFFFFF"
          justifyContent="space-between"
        >
          <Box width={drawerWidth}>
            <Divider />
            <MainMenu />
          </Box>
          {this.renderProfile()}
        </Box>
        <StyledMain component="main">
          <StyledAppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                {appBarContent || pageTitle}
              </Typography>
            </Toolbar>
          </StyledAppBar>
          <StyledToolbar component="div" />
          <Box padding={2}>{children}</Box>
        </StyledMain>
      </Box>
    );
  }
}

export default PageLayout;
