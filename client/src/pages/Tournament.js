import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import TournamentPlayers from '../containers/TournamentsPlayers';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Start from '../components/Start';
import GamesInTournament from '../containers/GamesInTournament';
import RandomGames from '../containers/RandomGames';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: 25,
  },
});

class Tournament extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Header />
        <Start />
        <RandomGames id={this.props.match.params.id} />
        <Menu title="Tournament" />
        <div className={classes.content}>
          <TournamentPlayers id={this.props.match.params.id} />
          <GamesInTournament id={this.props.match.params.id} />
        </div>
      </div>
    );
  }
}

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournament));
