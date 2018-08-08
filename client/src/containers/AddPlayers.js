import { connect } from 'react-redux';
import AddPlayersComponent from '../components/AddPlayers';
import { fetchAllPlayers } from '../services';
import { isInTournament } from '../reducers';
import { actions } from '../reducers/tournaments';
import { getTournamentRanking } from '../reducers/ranking';

const mapStateToProps = (state, props) => {
  const players = [];
  Object.keys(state.players).forEach(id => {
    if (isInTournament(state, props.id, id)) {
      players.push(state.players[id]);
    }
  });
  return {
    players,
    tournament: props.id,
    ranking: getTournamentRanking(state, props.id),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => {
      dispatch(fetchAllPlayers());
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
