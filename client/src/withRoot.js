import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber';
import grey from 'material-ui/colors/grey';
import Reboot from 'material-ui/Reboot';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ff833a',
      main: '#e65100',
      dark: '#ac1900',
      contrastText: '#eeeeee',
    },
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Reboot />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
