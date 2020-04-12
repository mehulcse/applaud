import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ErrorBoundary from "./error-boundary";
import { CustomApolloProvider } from "./core/apollo-provider";
import { ConnectivityMonitor } from "./core/connectivity-monitor";
import theme from "./core/mui-theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import AuthManager from "./core/auth-manager";
import Notifier from "./components/notifier";
import { LoginContainer } from "./routes/login/login-container";
import Dashboard from "./routes/dashboard/dashboard";
import Users from "./routes/users/users";
import UserDetail from "./routes/user-detail/user-detail";
import Teams from "./routes/teams/teams";
import TeamDetail from "./routes/team-detail/team-detail";
import Departments from "./routes/departments/departments";
import Applaud from "./routes/applaud/applaud";
import NotFoundRouteHandler from "./routes/not-found";
import Manage from "./routes/manage/manage";
import Feedback from "./routes/feedback/feedback";
import LandingPage from "./routes/landing-page";
import "./app.css";

function App() {
  return (
    <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <ConnectivityMonitor>
          <CustomApolloProvider>
            <Router>
              <AuthManager>
                <Switch>
                  <Route path="/login" exact component={LoginContainer} />
                  <Route path="/dashboard" exact component={Dashboard} />
                  <Route path="/applaud" exact component={Applaud} />
                  <Route path="/users" exact component={Users} />
                  <Route path="/users/:id" exact component={UserDetail} />
                  <Route path="/teams" exact component={Teams} />
                  <Route path="/teams/:id" exact component={TeamDetail} />
                  <Route path="/departments" exact component={Departments} />
                  <Route path="/manage" exact component={Manage} />
                  <Route path="/feedback" exact component={Feedback} />
                  <Route path="/" exact component={LandingPage} />
                  <Route path="*" component={NotFoundRouteHandler} />
                </Switch>
              </AuthManager>
              <Notifier />
            </Router>
          </CustomApolloProvider>
        </ConnectivityMonitor>
      </MuiThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
