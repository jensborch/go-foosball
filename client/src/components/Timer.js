import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import withRoot from '../withRoot';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexFlow: 'column',
  },
  content: {
    textAlign: 'center',
    padding: theme.spacing.unit * 4,
    flex: 1,
  },
  button: {
    align: 'center',
    padding: theme.spacing.unit * 3,
  },
});

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timerHandle = undefined;
    this.reset = this.reset.bind(this);
    this.timer = this.timer.bind(this);
  }

  state = {
    countdown: this.printCountDown(this.props.timeout),
  };

  componentWillReceiveProps(nextProps) {
    this.reset();
    if (nextProps.open) {
      this.timerHandle = setInterval(this.timer, 1000);
    } else if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  reset() {
    this.timeout = this.props.timeout;
    this.setState({
      countdown: this.printCountDown(this.timeout),
    });
  }

  format(time) {
    return time < 10 ? '0' + time : time;
  }

  printCountDown(timeout) {
    return (
      this.format(this.minutes(timeout)) +
      ':' +
      this.format(this.seconds(timeout))
    );
  }

  minutes(timeout) {
    return Math.floor(timeout / 60);
  }

  seconds(timeout) {
    return timeout % 60;
  }

  timer() {
    this.setState({
      countdown: this.printCountDown(this.timeout),
    });

    if (--this.timeout < 0 && this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <div className={classes.paper}>
          <div className={classes.content}>
            <Typography noWrap={true} variant="h2">
              Timer
            </Typography>
            <Typography noWrap={true} variant="h1">
              {this.state.countdown}
            </Typography>
          </div>
          <Button
            className={classes.button}
            variant="raised"
            color="secondary"
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}

Timer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  timeout: PropTypes.number.isRequired,
};

export default withRoot(withStyles(styles)(Timer));
