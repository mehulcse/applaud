import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#3FBEED",
      light: "#7EF1FF",
      dark: "#008EBA",
      contrastText: "#000"
    },
    secondary: {
      main: "#EC6C3D",
      light: "#FF9D6A",
      dark: "#B43C11",
      contrastText: "#000"
    }
  },
  typography: {
    fontSize: 13,
    fontFamily: `"Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif`
  }
};

const theme = createMuiTheme(themeOptions);

export default theme;