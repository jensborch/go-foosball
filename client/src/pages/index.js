import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  root: {

  },
  flex: {
    flex: 1
  }  
});

class Index extends React.Component {

  loadAll = () => {}

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
         <AppBar title="Case client" position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              Case client
            </Typography>
            <IconButton onClick={this.loadAll}>
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
