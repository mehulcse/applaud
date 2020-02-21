import { styled } from "@material-ui/styles";
import { Box } from "@material-ui/core";

export const StyledTableWrapper = styled(Box)({
  "& tbody": {
    display: "block",
    overflow: "auto",
    "& tr": {
      display: "table",
      width: "100%",
      tableLayout: "fixed"
    }
  },
  "& thead": {
    display: "table",
    width: "100%",
    tableLayout: "fixed"
  }
});
