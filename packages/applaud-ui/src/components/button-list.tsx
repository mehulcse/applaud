import { styled, Box } from "@material-ui/core";
import theme from "../core/mui-theme";

export const ButtonList = styled(Box)({
  "& > *": {
    marginRight: theme.spacing(1)
  }
});
