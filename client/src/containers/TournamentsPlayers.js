import { connect } from 'react-redux';
import Players from '../components/Players';
import { fetchTournamentPlayers } from '../actions/actions';

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
    activate: id => dispatch(fetchTournamentPlayers(id)),
    deactivete: id => dispatch(fetchTournamentPlayers(id)),
  };
};

const TournamentPlayers = connect(mapStateToProps, mapDispatchToProps)(Players);

export default TournamentPlayers;
