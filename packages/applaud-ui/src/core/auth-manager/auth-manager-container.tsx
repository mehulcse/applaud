import React from "react";
import AuthManager from "./auth-manager";
import {
  useAuthManagerQuery,
  useLogoutUserMutation
} from "../../generated/graphql";

interface Props {
  children: React.ReactNode;
}

export function AuthManagerContainer(props: Props) {
  const queryResult = useAuthManagerQuery({
    fetchPolicy: "network-only"
  });
  const [logoutUserMutation] = useLogoutUserMutation();

  return (
    <AuthManager
      queryResult={queryResult}
      logoutUserMutation={logoutUserMutation}
    >
      {props.children}
    </AuthManager>
  );
}
