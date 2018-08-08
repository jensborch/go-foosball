import { connect } from 'react-redux';
import TournamentPlayersComponent from '../components/TournamentPlayers';
import { getPlayerRanking } from '../reducers/ranking';
import {
  fetchTournamentPlayers,
  activatePlayer,
  deactivatePlayer,
  fetchTournaments,
} from '../services';
import { getActivePlayers, getInactivePlayers } from '../reducers/players';

const mapStateToProps = (state, props) => {
  const players = [];
  const active = getActivePlayers(state, props.id);
  const inactive = getInactivePlayers(state, props.id);
  active.forEach(nickname => {
    players.push({
      ...state.players[nickname],
      ranking: getPlayerRanking(state, props.id, nickname),
      active: true,
    });
  });
  inactive.forEach(nickname => {
    players.push({
      ...state.players[nickname],
      ranking: getPlayerRanking(state, props.id, nickname),
      active: false,
    });
  });
  return {
    id: props.id,
    data: players.sort((p1, p2) => p1.realname.localeCompare(p2.realname)),
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: id => {
      dispatch(fetchTournamentPlayers(id));
      dispatch(fetchTournaments());
    },
    select: (tournamentId, playerId, ranking) =>
      dispatch(activatePlayer(tournamentId, playerId, ranking)),
    deselect: (tournamentId, playerId) =>
      dispatch(deactivatePlayer(tournamentId, playerId)),
  };
};

const TournamentPlayers = connect(mapStateToProps, mapDispatchToProps)(
  TournamentPlayersComponent
);

export default TournamentPlayers;
