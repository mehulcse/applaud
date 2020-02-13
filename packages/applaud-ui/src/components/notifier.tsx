import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContentWrapper, {
  variantIcon
} from "../components/snackbar-content-wrapper";

let openSnackbarFn: Function;

interface State {
  open: boolean;
  message: string;
  variant: keyof typeof variantIcon;
}

class Notifier extends React.Component<{}, State> {
  state = {
    open: false,
    message: "",
    variant: "info" as keyof typeof variantIcon
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: "",
      variant: "info"
    });
  };

  openSnackbar = (
    { message }: { message: string },
    variant: keyof typeof variantIcon
  ) => {
    this.setState({ open: true, message, variant });
  };

  render() {
    const { open, message, variant } = this.state;

    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
        open={open}
        ContentProps={{
          "aria-describedby": "snackbar-message-id"
        }}
      >
        <SnackbarContentWrapper
          onClose={this.handleSnackbarClose}
          variant={variant as (keyof typeof variantIcon)}
          message={message}
        />
      </Snackbar>
    );
  }
}

export function openSnackbar(
  { message }: { message: string },
  variant: keyof typeof variantIcon
) {
  openSnackbarFn({ message }, variant);
}

export default Notifier;