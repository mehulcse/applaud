import React, { useContext } from "react";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { openSnackbar } from "../components/notifier";
import { ConnectivityContext } from "./connectivity-monitor";
import { ServerError } from "apollo-link-http-common";

interface ClientOptions {
  onNetworkError?: () => any;
}

export const getClient = (options?: ClientOptions) =>
  new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URL,
    credentials: "include",
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        const message = graphQLErrors.map(({ message }) => message).join(" ");
        openSnackbar({ message }, "error");
      }
      if (networkError) {
        if (!(networkError as ServerError).statusCode) {
          if (options && options.onNetworkError) {
            options.onNetworkError();
          }
        }
      }
    }
  });

export const client = getClient();

interface Props {
  children: React.ReactNode;
}

export const CustomApolloProvider = (props: Props) => {
  const { children } = props;
  const connectivityContext = useContext(ConnectivityContext);
  const onNetworkError = () => {
    connectivityContext.testApiConnectivity();
  };
  return (
    <ApolloProvider client={getClient({ onNetworkError })}>
      {children}
    </ApolloProvider>
  );
};
