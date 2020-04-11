import React, { Component } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import Loader from "../../components/loader";
import {
  AuthManagerQueryResult,
  CoinBalance,
  LogoutUserMutationFn,
  User
} from "../../generated/graphql";
import { ConnectivityContext } from "../connectivity-monitor";
import { LOADER_TYPE } from "../../constants/constants";

type ViewerUser = { __typename?: "User" } & Pick<
  User,
  "id" | "firstName" | "lastName" | "email"
>;

type CoingBalanceViewer = { __typename?: "CoinBalance" } & Pick<
  CoinBalance,
  "id" | "balance"
>;

export interface AuthContextValue {
  isLoading: boolean;
  isLoggedIn: boolean;
  refresh: () => Promise<any>;
  logout: () => Promise<any>;
  user: ViewerUser | null;
  userRoles: string[];
  isAdmin: boolean;
  coinBalance: CoingBalanceViewer | null;
  coinsReceivedBalance: number;
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
  user: null,
  userRoles: [],
  isAdmin: false,
  coinBalance: null,
  coinsReceivedBalance: 0
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
      user: null,
      userRoles: [],
      isAdmin: false,
      coinBalance: null,
      coinsReceivedBalance: 0
    };

    if (!queryResult.loading) {
      const { data, error } = queryResult;
      if (data) {
        contextValue.isLoggedIn = !error && !!data.viewer && !!data.viewer.user;
        contextValue.user =
          data && data.viewer && data.viewer.user ? data.viewer.user : null;
        contextValue.userRoles =
          data && data.viewer && data.viewer.userRoles
            ? data.viewer.userRoles
            : [];
        contextValue.isAdmin =
          data && data.viewer ? !!data.viewer.isAdmin : false;
        contextValue.coinBalance =
          data && data.viewer && data.viewer.coinBalance
            ? data.viewer.coinBalance
            : null;
        contextValue.coinsReceivedBalance =
          data && data.viewer && data.viewer.coinsReceivedBalance
            ? data.viewer.coinsReceivedBalance
            : 0;
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
      return <Loader type={LOADER_TYPE.fullView} />;
    }
    if (!isLoggedIn && !pathname.startsWith("/login") && pathname !== "/") {
      return <Redirect to="/" />;
    }

    if (isLoggedIn && (pathname.startsWith("/login") || pathname === "/")) {
      return <Redirect to="/dashboard" />;
    }
    return children;
  }
}

export default withRouter(AuthManager);
