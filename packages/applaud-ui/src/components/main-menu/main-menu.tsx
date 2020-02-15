import React from "react";
import { withRouter } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

import AppLink from "../app-link";

const StyledListItemText = styled(ListItemText)({
  "& span": {
    fontSize: "0.9rem"
  }
});

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)({
  fontSize: "0.9rem"
});

function MainMenuContent({ location }: { location: any }) {
  const pathParts = location.pathname.match(/^\/([a-zA-Z-]+)/i);
  let basePath = "/";
  if (pathParts && pathParts.length && pathParts.length > 0) {
    basePath = pathParts[0];
  }
  return (
    <List
      subheader={
        <>
          <ListSubheader>ADMIN</ListSubheader>
          <Divider />
        </>
      }
    >
      <AppLink to="/dashboard">
        <ListItem button selected={basePath === "/dashboard"}>
          <ListItemIcon>
            <StyledFontAwesomeIcon icon={faTachometerAlt} fixedWidth />
          </ListItemIcon>
          <StyledListItemText primary="Dashboard" />
        </ListItem>
      </AppLink>
      <AppLink to="/applaud">
        <ListItem button selected={basePath === "/applaud"}>
          <ListItemIcon>
            <img
              style={{ maxHeight: "15px" }}
              src="data:image/png;base64,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" />
          </ListItemIcon>
          <StyledListItemText primary="Applaud" />
        </ListItem>
      </AppLink>
      <AppLink to="/users">
        <ListItem button selected={basePath === "/users"}>
          <ListItemIcon>
            <StyledFontAwesomeIcon icon={faUsers} fixedWidth />
          </ListItemIcon>
          <StyledListItemText primary="Users" />
        </ListItem>
      </AppLink>
    </List>
  );
}

export default withRouter(MainMenuContent);
