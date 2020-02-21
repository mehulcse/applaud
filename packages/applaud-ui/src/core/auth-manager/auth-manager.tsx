import React, { Component } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import Loader from "../../components/loader";
import {
  AuthManagerQueryResult,
  LogoutUserMutationFn,
  User
} from "../../generated/graphql";
import { ConnectivityContext } from "../connectivity-monitor";

type ViewerUser = { __typename?: "User" } & Pick<
  User,
  "id" | "firstName" | "lastName" | "email"
>;

export interface AuthContextValue {
  isLoading: boolean;
  isLoggedIn: boolean;
  refresh: () => Promise<any>;
  logout: () => Promise<any>;
  user: ViewerUser | null;
}

interface Props extends RouteComponentProps {
  queryResult: AuthManagerQueryResult;
  children: React.ReactNode;
  logoutUserMutation: LogoutUserMutationFn;
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
    const { queryResult, logoutUserMutation } = this.props;
    const contextValue: AuthContextValue = {
      isLoading: queryResult.loading,
      isLoggedIn: false,
      refresh: queryResult.refetch,
      logout: async () => {
        await logoutUserMutation();
        await queryResult.refetch();
      },
      user: null
    };

    if (!queryResult.loading) {
      const { data, error } = queryResult;
      if (data) {
        contextValue.isLoggedIn = !error && !!data.viewer;
        contextValue.user = data.viewer;
      }
    }

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
