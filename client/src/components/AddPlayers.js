import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import PlayersGrid from './PlayersGrid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '80%',
    boxShadow: theme.shadows[5],
    display: 'flex',
    justifyContent: 'space-between',
  },
  card: {
    height: '250px',
    margin: theme.spacing.unit * 3,
  },
  cell: {
    height: '100px',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
  cardButton: {
    margin: theme.spacing.unit,
  },
  dismissButton: {
    margin: theme.spacing.unit * 2,
  },
});

class AddPlayers extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { classes } = this.props;
    const { paper, dismissButton, ...childClasses } = classes;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <Paper className={paper}>
          <Grid
            style={{ overflow: 'auto' }}
            container
            direction="column"
            justify="space-between"
            spacing={8}
          >
            <PlayersGrid
              players={this.props.players}
              ranking={this.props.ranking}
              tournament={this.props.tournament}
              classes={childClasses}
              select={this.props.select}
            />
            <Button
              className={classes.dismissButton}
              variant="contained"
              color="secondary"
              onClick={this.props.onClose}
            >
              Dismiss
            </Button>
          </Grid>
        </Paper>
      </Modal>
    );
  }
}

AddPlayers.propTypes = {
  classes: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  ranking: PropTypes.number.isRequired,
  tournament: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(AddPlayers));
