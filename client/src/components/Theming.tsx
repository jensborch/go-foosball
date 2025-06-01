import { createTheme, ThemeProvider } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#62727b",
      main: "#37474f",
      dark: "#102027",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#ff833a",
      main: "#e65100",
      dark: "#ac1900",
      contrastText: "#eeeeee",
    },
  },
});

export interface Props {
  children: React.ReactNode;
}

function Theming(props: Props) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default Theming;
