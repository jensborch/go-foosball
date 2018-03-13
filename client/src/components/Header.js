import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.secondary.light,
    height: theme.spacing.unit * 20,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
});

class Header extends React.Component {
  render() {
    const { classes } = this.props;
    return <div className={classes.header} />;
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Header));
