import React, { Component } from "react";

interface Props {}

interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true
    };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Some Error Spotted here!</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
