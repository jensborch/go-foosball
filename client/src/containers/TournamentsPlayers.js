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
  const inactive = state.inactive[props.id] ? state.inactive[props.id] : [];
  active.forEach(nickname => {
    players.push({ ...state.players[nickname], active: true });
  });
  inactive.forEach(nickname => {
    players.push({ ...state.players[nickname], active: false });
  });
  return {
    id: props.id,
    data: players.sort((p1, p2) => p1.realname.localeCompare(p2.realname)),
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
