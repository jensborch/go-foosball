import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import withRoot from '../withRoot';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class Timer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.props.onClose}
        >
          <div className={classes.paper}>
            <Typography variant="display4" id="modal-title">
              Timer
            </Typography>
            <Typography variant="subheading" id="simple-modal-description">
              2:00:00
            </Typography>
            <Button
              variant="raised"
              color="secondary"
              className={classes.button}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

Timer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(Timer));
