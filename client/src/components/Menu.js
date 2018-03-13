import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import RefreshIcon from 'material-ui-icons/Refresh';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import { Link } from 'react-router-dom';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Menu extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            to="/"
            component={props => <Link {...props} />}
            className={classes.menuButton}
            color="inherit"
            aria-label="Home"
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            {this.props.title}
          </Typography>
          {this.props.fetch ? (
            <IconButton
              color="inherit"
              aria-label="Refresh"
              onClick={this.props.fetch}
            >
              <RefreshIcon />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  fetch: PropTypes.func,
};

export default withRoot(withStyles(styles)(Menu));
