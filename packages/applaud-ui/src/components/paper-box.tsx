import React, { Component } from "react";
import { styled } from "@material-ui/styles";
import { Paper } from "@material-ui/core";
import theme from "../core/mui-theme";
import { PaperProps } from "@material-ui/core/Paper";

interface Props extends PaperProps {
  gutterBottom?: boolean;
}

const StyledPaper = styled(({ gutterBottom, ...rest }: Props) => (
  <Paper {...rest} />
))({
  padding: theme.spacing(3, 2),
  marginBottom: (props: Props) =>
    props.gutterBottom ? theme.spacing(2) : "inherit"
});

class PaperBox extends Component<Props> {
  render() {
    const { children, ...rest } = this.props;
    return <StyledPaper {...rest}>{children}</StyledPaper>;
  }
}

export default PaperBox;
