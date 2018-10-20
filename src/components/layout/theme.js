import { createMuiTheme } from "@material-ui/core/styles";
import primaryColor from "@material-ui/core/colors/indigo";
// import pink from "@material-ui/core/colors/pink";

export default createMuiTheme({
  palette: {
    type: "light",
    primary: primaryColor
    // secondary: pink
  },
  typography: {
    useNextVariants: true
    // title: { color: "red" }
  }
});
