import React, { Component } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import Loader from "../../components/loader";
import { ConnectivityContext } from "../connectivity-monitor";

export interface AuthContextValue {
  isLoading: boolean;
  isLoggedIn: boolean;
  refresh: () => Promise<any>;
  logout: () => Promise<any>;
  user: null;
}

interface Props extends RouteComponentProps {
}

export const AuthContext = React.createContext<AuthContextValue>({
  isLoading: true,
  isLoggedIn: false,
  refresh: async () => {},
  logout: async () => {},
  user: null
});

class AuthManager extends Component<Props> {
  render() {
    const contextValue: AuthContextValue = {
      isLoading: false,
      isLoggedIn: true,
      refresh: async () => {},
      logout: async () => {},
      user: null
    };

    return (
      <AuthContext.Provider value={contextValue}>
        <ConnectivityContext.Consumer>
          {connectivityContext =>
            this.renderContent(contextValue, connectivityContext.isConnected)
          }
        </ConnectivityContext.Consumer>
      </AuthContext.Provider>
    );
  }

  logout = () => {};

  renderContent(contextValue: AuthContextValue, isConnected: boolean) {
    const {
      children,
      location: { pathname }
    } = this.props;
    if (!contextValue) {
      return null;
    }
    if (!isConnected) {
      // If API connectivity goes down, prevent redirects for an improved user experience.
      return null;
    }
    const { isLoading, isLoggedIn } = contextValue;
    if (isLoading) {
      return <Loader />;
    }
    if (!isLoggedIn && !pathname.startsWith("/login")) {
      return <Redirect to="/login" />;
    }
    if (isLoggedIn && pathname.startsWith("/login")) {
      return <Redirect to="/" />;
    }
    return children;
  }
}

export default withRouter(AuthManager);