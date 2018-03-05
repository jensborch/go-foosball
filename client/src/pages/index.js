import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import HomeIcon  from 'material-ui-icons/Home';
import RefreshIcon from 'material-ui-icons/Refresh';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }
});

class Index extends React.Component {

  loadAll = () => {}

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
         <AppBar position="static">
          <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Home">
          <HomeIcon />
          </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Foosball
            </Typography>
            <IconButton color="inherit" aria-label="Refresh" onClick={this.loadAll}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
