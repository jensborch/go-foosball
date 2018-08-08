import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import PlayersGrid from './PlayersGrid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
  },
  cell: {
    height: '150px',
    //width: '100px',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
  button: {
    align: 'center',
    padding: theme.spacing.unit * 3,
  },
});

class AddPlayers extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }

  render() {
    const { classes } = this.props;
    const { paper, list, button, players, ...childClasses } = classes;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <div className={paper}>
          <PlayersGrid
            players={this.props.players}
            ranking={this.props.ranking}
            tournament={this.props.tournament}
            classes={childClasses}
            select={this.props.select}
            deselect={this.props.deselect}
          />
          <Button
            className={button}
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
  fetch: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  ranking: PropTypes.number.isRequired,
  tournament: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(AddPlayers));
