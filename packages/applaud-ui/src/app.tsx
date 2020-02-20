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
import Dashboard from "./routes/dashboard/dashboard";
import Users from "./routes/users/users";
import Applaud from "./routes/applaud/applaud";
import NotFoundRouteHandler from "./routes/not-found";
import "./app.css";
import ApplaudCard from "./components/Card/applaudCard";

const applaudCardData = [
  {
    header: "Above and Beyond",
    imageUrl: `images/rocket.gif`,
    altName: "Above and Beyond",
    id: "aboveBeyond"
  },
  {
    header: "You Rock",
    imageUrl: `images/rocket.gif`,
    altName: "youRock",
    id: "youRock"
  },
  {
    header: "Ninja",
    imageUrl: `images/ninja.gif`,
    altName: "ninja",
    id: "ninja"
  },
  {
    header: "Thank You",
    imageUrl: `images/Thankyou.gif`,
    altName: "thankYou",
    id: "thankYou"
  },
  {
    header: "Gladiator",
    subHeader: "You Did It",
    imageUrl: `images/gladiator.gif`,
    altName: "gladiator",
    id: "gladiator"
  },
  {
    header: "Congratulations",
    imageUrl: `images/congratulations.gif`,
    altName: "congrats",
    id: "congrats"
  },
  {
    header: "Well Done",
    imageUrl: `images/welldone.gif`,
    altName: "welldone",
    id: "wellDone"
  }
];

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      {/* <section className="cardContainer">
        {applaudCardData.map(item => {
          return <ApplaudCard key={item.id} data={item} />;
        })}
      </section> */}
      <ConnectivityMonitor>
        <CustomApolloProvider>
          <Router>
            <AuthManager>
              <Switch>
                <Route
                  path="/"
                  exact
                  render={() => <Redirect to="/dashboard" />}
                />
                <Route path="/dashboard" exact component={Dashboard} />
                <Route path="/applaud" exact component={Applaud} />
                <Route path="/users" exact component={Users} />
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
