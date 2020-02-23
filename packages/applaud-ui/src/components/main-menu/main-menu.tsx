import React, {useContext} from "react";
import {withRouter} from "react-router-dom";
import {
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {styled} from "@material-ui/styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AuthContext} from "../../core/auth-manager";
import {
  faTachometerAlt,
  faUsers,
  faPeopleCarry,
  faStore,
  faCog,
  faSignLanguage
} from "@fortawesome/free-solid-svg-icons";

import AppLink from "../app-link";
import logo from "../../logo.svg";
import {makeStyles} from "@material-ui/core/styles";
import theme from "../../core/mui-theme";

const StyledListItemText = styled(ListItemText)({
  "& span": {
    fontSize: "0.9rem",
    color: theme.palette.common.white
  }
});

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)({
  fontSize: "0.9rem"
});

const useStyles = makeStyles(() =>
  createStyles({
    logo: {
      maxWidth: 200
    },
    logoWrapper: {
      marginBottom: 10
    },
    selected: {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(255, 255, 255, 0.00) !important",
      borderLeft: `2px solid ${theme.palette.primary.main}`
    }
  })
);

function MainMenuContent({location}: { location: any }) {
  const pathParts = location.pathname.match(/^\/([a-zA-Z-]+)/i);
  const authContext = useContext(AuthContext);
  let basePath = "/";
  if (pathParts && pathParts.length && pathParts.length > 0) {
    basePath = pathParts[0];
  }
  const classes = useStyles();
  return (
    <List>
      <AppLink to="/dashboard">
        <ListItem className={classes.logoWrapper}>
          <img src={logo} alt="logo" className={classes.logo}/>
        </ListItem>
      </AppLink>
      <AppLink to="/dashboard">
        <ListItem
          button
          selected={basePath === "/dashboard"}
          className={basePath === "/dashboard" ? classes.selected : ""}
        >
          <ListItemIcon>
            <StyledFontAwesomeIcon icon={faTachometerAlt} fixedWidth/>
          </ListItemIcon>
          <StyledListItemText primary="Dashboard"/>
        </ListItem>
      </AppLink>
      <AppLink to="/applaud">
        <ListItem
          button
          selected={basePath === "/applaud"}
          className={basePath === "/applaud" ? classes.selected : ""}
        >
          {/*<ListItemIcon>*/}
          {/*  <img*/}
          {/*    alt="Applaud"*/}
          {/*    style={{ maxHeight: "15px" }}*/}
          {/*    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAACY0lEQVRIia3WS4jOURjH8Y/RCA1yqzFFJhuzsWBDKQshpSQ02ExuG8rGLSWFhSQ7Jtm4LiiUjR2xwMIlMkljQcmlXJIhgzGvxXn+8/69/vMO73jq9P5/5/J8zznPec55qc3WoBMLaxzfr43BZWwLvR8lfETL/wTNCMcltGE4bod+inH/E7YLD/AVczAJLwJ2FfWDcT4SV8JpZoujbihm4UvA2ivGLsQhNA8EWY3Z8V2Pizifa6+L31b0BmxT1I1Dd9TdrAZZEJ06Q7eFfh+AtfiOldG+L9p/YD6mKMe0OzepP+y68nbU4XHovRimHJuN0b8Rd3KTaUFPDtZUBJmbm10zlofuwnhsCP0GIwIyLSbwMNoe410ONFuBXYnGU6Hvhj4sHYDO0Dulw/IytmcCduec50trJWSmFNifsfxFyvvchFWhP2A0toR+GSs62g9oRyXoYjRcCH0j9DEMwX3lWNXjeeitGBUTKAIdyUNaYiUl6URlTnukGCzxe6zWh36Hhph1EaSEc3nQ6X46dcUWZVdOFqunofdIV9LrKqC+/GuWTll/HfNlupTMJXzCWClRq405noHa/xJSwjM8ie+DUqyeDTCmjXR6Pv8DKCtfpRxaoRzbovJKemasqwFSko5yZhNxsqBPr5Tw4EwNkO+YKp3Es+GsDvdyfXpiEX12rQbQNenFzfQ36To6EPotlqqwSzVuXb48ihWdkHKmsRICmwcB6JXyb2L4KrylM2tQTr5/KR2YV81xkbUo31sDlc/YbhD/EcZLifutCuQCJtfifEhB3Vgsk57zJule65BicasWCPwCXKNZew8dx5sAAAAASUVORK5CYII="*/}
          {/*  />*/}
          {/*</ListItemIcon>*/}
          <ListItemIcon>
            <StyledFontAwesomeIcon icon={faSignLanguage} fixedWidth/>
          </ListItemIcon>
          <StyledListItemText primary="Applaud"/>
        </ListItem>
      </AppLink>
      {authContext && authContext.isAdmin && (
        <>
          <AppLink to="/users">
            <ListItem
              button
              selected={basePath === "/users"}
              className={basePath === "/users" ? classes.selected : ""}
            >
              <ListItemIcon>
                <StyledFontAwesomeIcon icon={faUsers} fixedWidth/>
              </ListItemIcon>
              <StyledListItemText primary="Users"/>
            </ListItem>
          </AppLink>
          <AppLink to="/teams">
            <ListItem
              button
              selected={basePath === "/teams"}
              className={basePath === "/teams" ? classes.selected : ""}
            >
              <ListItemIcon>
                <StyledFontAwesomeIcon icon={faPeopleCarry} fixedWidth/>
              </ListItemIcon>
              <StyledListItemText primary="Teams"/>
            </ListItem>
          </AppLink>
          <AppLink to="/departments">
            <ListItem
              button
              selected={basePath === "/departments"}
              className={basePath === "/departments" ? classes.selected : ""}
            >
              <ListItemIcon>
                <StyledFontAwesomeIcon icon={faStore} fixedWidth/>
              </ListItemIcon>
              <StyledListItemText primary="Departments"/>
            </ListItem>
          </AppLink>
          <AppLink to="/manage">
            <ListItem
              button
              selected={basePath === "/manage"}
              className={basePath === "/manage" ? classes.selected : ""}
            >
              <ListItemIcon>
                <StyledFontAwesomeIcon icon={faCog} fixedWidth/>
              </ListItemIcon>
              <StyledListItemText primary="Manage"/>
            </ListItem>
          </AppLink>
        </>
      )}
    </List>
  );
}

export default withRouter(MainMenuContent);
