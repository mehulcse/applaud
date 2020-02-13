import React from "react";
import AuthManager from "./auth-manager";

interface Props {
  children: React.ReactNode;
}

export class AuthManagerContainer extends React.Component<Props> {
  render() {
    return (
      <AuthManager>
        {this.props.children}
      </AuthManager>
    );
  }
}
