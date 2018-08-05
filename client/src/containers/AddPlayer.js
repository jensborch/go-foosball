import { connect } from 'react-redux';
import AddPlayersComponent from '../components/AddPlayers';
import { fetchAllPlayers, fetchTournaments } from '../services';
import { isInTournament } from '../reducers';
import { actions } from '../reducers/tournaments';

const mapStateToProps = (state, props) => {
  const players = [];
  Object.keys(state.players).forEach(id => {
    if (isInTournament(state, props.id, id)) {
      players.push(state.players[id]);
    }
  });
  return {
    data: players,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => {
      dispatch(fetchAllPlayers());
      dispatch(fetchTournaments());
    },
    select: (tournamentId, playerId, score) =>
      dispatch(actions.activateTournamentPlayer(tournamentId, playerId, score)),
    deselect: (tournamentId, playerId) =>
      dispatch(actions.deactivateTournamentPlayer(tournamentId, playerId)),
  };
};

const AddPlayers = connect(mapStateToProps, mapDispatchToProps)(
  AddPlayersComponent
);

export default AddPlayers;
