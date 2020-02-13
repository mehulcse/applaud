import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { CustomApolloProvider } from "./core/apollo-provider";
import { ConnectivityMonitor } from "./core/connectivity-monitor";
import theme from "./core/mui-theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import AuthManager from "./core/auth-manager";
import Notifier from "./components/notifier";
import Mudra from "./routes/mudra/mudra";
import NotFoundRouteHandler from "./routes/not-found";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ConnectivityMonitor>
        <CustomApolloProvider>
          <Router>
            <AuthManager>
              <Switch>
                <Route
                  path="/"
                  exact
                  render={() => <Redirect to="/mudra" />}
                />
                <Route
                  path="/mudra"
                  exact
                  component={Mudra}
                />
                <Route path="*" component={NotFoundRouteHandler} />
              </Switch>
            </AuthManager>
            <Notifier />
          </Router>
        </CustomApolloProvider>
      </ConnectivityMonitor>
    </MuiThemeProvider>
  );
}

export default App;