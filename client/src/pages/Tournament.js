import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import TournamentPlayers from '../containers/TournamentsPlayers';
import Menu from '../components/Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Tournament extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Menu title="Tournament" />
        <TournamentPlayers id={this.props.match.params.id}/>
      </div>
    );
  }
}

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournament));