import React, { ChangeEvent } from "react";
import { InputBase, Paper, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AppIcon from "./app-icon";

const styles = createStyles({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  }
});

interface Props {
  placeholder: string;
  onChange: Function;
  classes: any;
  inputValue?: string;
}

interface State {
  inputValue: string;
}

class SearchBox extends React.Component<Props, State> {
  private timeout: any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.inputValue || ""
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.inputValue && !this.props.inputValue) {
      this.setState({
        inputValue: ""
      });
    }
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    this.setState({ inputValue: value });
    // onChange calls api when user has typed more than 3 characters or field is empty so we reinitialize list
    if (value.length > 1 || value === "") {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.props.onChange(value);
      }, 250);
    }
  };

  render() {
    const { classes, placeholder } = this.props;
    return (
      <Paper className={classes.root}>
        <InputBase
          value={this.state.inputValue}
          onChange={this.handleChange}
          className={classes.input}
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
        />
        <IconButton className={classes.iconButton} aria-label="search">
          <AppIcon icon={faSearch} size="xs" />
        </IconButton>
      </Paper>
    );
  }
}

export const SearchInput = withStyles(styles)(SearchBox);
