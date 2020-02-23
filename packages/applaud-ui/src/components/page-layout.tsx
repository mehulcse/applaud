import React, { Component } from "react";
import { styled, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
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
import clap from "../clap.svg";
import AppIcon from "../components/app-icon";
import { AuthContext } from "../core/auth-manager";
import { AuthContextValue } from "../core/auth-manager/auth-manager";
import Loader from "./loader";
import { LOADER_TYPE } from "../constants/constants";

const drawerWidth = 250;

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
  loading: boolean;
}

class PageLayout extends Component<Props, State> {
  static contextType = AuthContext;
  state = {
    openEl: null,
    loading: false
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
    this.setState({
      loading: true
    });
    (this.context as AuthContextValue).logout();
  };

  renderProfile() {
    const user = (this.context as AuthContextValue).user;
    const userName = user ? `${user.firstName} ${user.lastName}` : "-";
    const coinBalance =
      (this.context as AuthContextValue)?.coinBalance?.balance ?? 0;
    const coinsReceivedBalance =
      (this.context as AuthContextValue)?.coinsReceivedBalance ?? 0;

    return (
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={clap} />
          </ListItemAvatar>
          <ListItemText
            aria-controls="clap-balance"
            aria-haspopup="true"
            secondary="Received Claps"
          >
            <span title="Received Claps">{coinsReceivedBalance}</span>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={clap} />
          </ListItemAvatar>
          <ListItemText
            aria-controls="clap-balance"
            aria-haspopup="true"
            secondary="Available Claps"
          >
            <span title="Available Claps">{coinBalance}</span>
          </ListItemText>
        </ListItem>
        <ListItem button onClick={this.handleClick}>
          <ListItemAvatar>
            <Avatar>
              <AppIcon icon={faUser} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            aria-controls="user-menu"
            aria-haspopup="true"
            style={{ position: "relative" }}
            secondary="Current User"
          >
            <span title={userName}>{userName}</span>
          </ListItemText>
        </ListItem>
        <StyledMenu
          id="user-menu"
          anchorEl={this.state.openEl}
          open={Boolean(this.state.openEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.signOut}>Sign out</MenuItem>
        </StyledMenu>
      </List>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Box component="div" display="flex" height="100vh" width="100%">
        <CssBaseline />
        <Box
          flexGrow={0}
          display="flex"
          flexDirection="column"
          borderRight="1px solid rgba(0, 0, 0, 0.12)"
          justifyContent="space-between"
        >
          <Box width={drawerWidth}>
            <MainMenu />
          </Box>
          {this.renderProfile()}
        </Box>
        <StyledMain component="main">
          {/*<StyledAppBar position="static">*/}
          {/*  <Toolbar>*/}
          {/*    <Typography variant="h6" color="inherit" noWrap>*/}
          {/*      {appBarContent || pageTitle}*/}
          {/*    </Typography>*/}
          {/*  </Toolbar>*/}
          {/*</StyledAppBar>*/}
          {/*<StyledToolbar component="div"/>*/}
          <Box padding={2}>{children}</Box>
        </StyledMain>
        {this.state.loading && <Loader type={LOADER_TYPE.fullView} />}
      </Box>
    );
  }
}

export default PageLayout;
