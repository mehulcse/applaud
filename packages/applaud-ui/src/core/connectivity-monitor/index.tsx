import React from "react";
import { ApiDown } from "./api-down";

interface Props {
  children: React.ReactNode;
}

interface State {
  isConnected: boolean;
  isPolling: boolean;
}

interface ConnectivityContextValue {
  isConnected: boolean;
  testApiConnectivity: () => any;
}

export const ConnectivityContext = React.createContext<
  ConnectivityContextValue
>({
  isConnected: true,
  testApiConnectivity: () => {}
});

export class ConnectivityMonitor extends React.Component<Props, State> {
  state: State = {
    isConnected: true,
    isPolling: true
  };

  pollingTimeout: any = null;

  testApiConnectivity = () => {
    const apiBase = new URL(process.env.REACT_APP_GRAPHQL_URL || "").host;
    fetch(`https://${apiBase}/local/health`)
      .then(() => {
        this.handleConnected();
      })
      .catch(err => {
        this.handleDisconnected();
      });
  };

  handleDisconnected = () => {
    this.setState({
      isConnected: false
    });

    if (!this.pollingTimeout) {
      this.pollingTimeout = setTimeout(() => {
        this.pollingTimeout = null;
        this.testApiConnectivity();
      }, 5000);
    }
  };

  handleConnected = () => {
    this.setState({
      isConnected: true
    });
  };

  render() {
    const { children } = this.props;
    const { isConnected } = this.state;
    return (
      <ConnectivityContext.Provider
        value={{ isConnected, testApiConnectivity: this.testApiConnectivity }}
      >
        {isConnected && children}
        {!isConnected && <ApiDown />}
      </ConnectivityContext.Provider>
    );
  }
}
