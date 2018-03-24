import { connect } from 'react-redux';
import Players from '../components/Players';
import {
  fetchTournamentPlayers,
  activatePlayer,
  deactivatePlayer,
} from '../actions/actions';

const mapStateToProps = (state, props) => {
  const players = [];
  const active = state.active[props.id] ? state.active[props.id] : [];
  active.forEach(nickname => {
    players.push(state.players[nickname]);
  });
  return {
    id: props.id,
    data: players,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: id => dispatch(fetchTournamentPlayers(id)),
    activate: (tournamentId, playerId) =>
      dispatch(activatePlayer(tournamentId, playerId)),
    deactivete: (tournamentId, playerId) =>
      dispatch(deactivatePlayer(tournamentId, playerId)),
  };
};

const TournamentPlayers = connect(mapStateToProps, mapDispatchToProps)(Players);

export default TournamentPlayers;
