import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import Launch from 'material-ui-icons/Launch';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Start extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Button
        variant="fab"
        color="default"
        aria-label="add"
        className={classes.button}
      >
        <Launch />
      </Button>
    );
  }
}

Start.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Start));
