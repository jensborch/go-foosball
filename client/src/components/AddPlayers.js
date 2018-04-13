import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Players from './Players';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

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
  list: {
    flex: 1,
  },
  players: {
    display: 'flex',
  },
  button: {
    align: 'center',
    padding: theme.spacing.unit * 3,
  },
});

class AddPlayers extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <div className={classes.paper}>
          <div className={classes.list}>
            <Players
              classes={classes.players}
              select={this.props.select}
              deselect={this.props.deselect}
              data={this.props.data}
              id={this.props.id}
            />
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

AddPlayers.propTypes = {
  classes: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(AddPlayers));
