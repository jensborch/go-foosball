import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Tables from './Tables';

const styles = theme => ({
  paper: {
    maxWidth: 250,
    minWidth: 250,
    margin: 20,
    display: 'flex',
    flexFlow: 'column',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  list: {
    flex: 1,
  },
});

class TournamentTables extends React.Component {
  state = {
    open: false,
  };

  componentDidMount() {
    this.props.fetch(this.props.tournamentId);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes } = this.props;
    const { paper, ...childClasses } = classes;
    return (
      <Paper className={paper} elevation={4}>
        <Tables
          classes={childClasses}
          fetch={this.props.fetch}
          select={this.props.select}
          deselect={this.props.deselect}
          tables={this.props.tables}
          tournamentId={this.props.tournamentId}
        />
        <Divider />
        {/* <BottomNavigation showLabels>
          <BottomNavigationAction
            onClick={this.handleOpen}
            label="Add"
            icon={<AddIcon />}
          />
          <AddPlayers
            open={this.state.open}
            onClose={this.handleClose}
            id={this.props.id}
          />
        </BottomNavigation> */}
      </Paper>
    );
  }
}

TournamentTables.propTypes = {
  classes: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  talbes: PropTypes.array.isRequired,
  tournamentId: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(TournamentTables));
