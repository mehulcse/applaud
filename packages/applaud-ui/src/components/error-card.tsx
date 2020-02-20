import React from "react";
import { ApolloError } from "apollo-client";
import { Typography } from "@material-ui/core";

interface Props {
  error?: ApolloError;
}

const ErrorCard = (props: Props) => {
  if (props.error && props.error.message) {
    return (
      <Typography variant="body2" align="center">
        {props.error.message}
      </Typography>
    );
  } else {
    return (
      <Typography variant="body2" align="center">
        Something went wrong!!
      </Typography>
    );
  }
};

export default ErrorCard;
