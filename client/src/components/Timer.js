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
    this.reset();
  }

  state = {
    countdown: '',
  };

  componentWillReceiveProps(nextProps) {
    this.reset();
    if (nextProps.open) {
      this.timerHandle = setInterval(this.timer, 1000);
    } else if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  reset = () => {
    this.setState({
      countdown: '',
    });
    this.timeout = this.props.timeout;
  };

  timer = () => {
    let minutes = Math.floor(this.timeout / 60);
    let seconds = this.timeout % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    this.setState({
      countdown: minutes + ':' + seconds,
    });

    if (--this.timeout < 0 && this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal open={this.props.open} onClose={this.props.onClose}>
          <div className={classes.paper}>
            <div className={classes.content}>
              <Typography noWrap={true} variant="display3">
                Timer
              </Typography>
              <Typography noWrap={true} variant="display4">
                {this.state.countdown}
              </Typography>
            </div>
            <Button
              className={classes.button}
              variant="raised"
              color="secondary"
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
  timeout: PropTypes.number.isRequired,
};

export default withRoot(withStyles(styles)(Timer));
