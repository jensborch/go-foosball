import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import Launch from 'material-ui-icons/Launch';
import Timer from './Timer';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Start extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="fab"
          color="default"
          aria-label="add"
          className={classes.button}
          onClick={this.handleOpen}
        >
          <Launch />
        </Button>
        <Timer open={this.state.open} onClose={this.handleClose} />
      </div>
    );
  }
}

Start.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Start));
