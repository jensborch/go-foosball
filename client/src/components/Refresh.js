import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import Refresh from 'material-ui-icons/Refresh';

const styles = theme => ({
  button: {
    position: 'absolute',
    top: theme.spacing.unit * 4,
    right: theme.spacing.unit * 15,
  },
});

class Start extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Button
        onClick={this.props.refresh}
        variant="fab"
        color="default"
        aria-label="add"
        className={classes.button}
      >
        <Refresh />
      </Button>
    );
  }
}

Start.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Start));
