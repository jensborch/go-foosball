import { connect } from 'react-redux';
import { fetchRandomgames, registerGame } from '../services';
import Games from '../components/Games';

const mapStateToProps = (state, props) => {
  const games =
    state.random && state.random[props.id] ? state.random[props.id] : [];
  return {
    id: props.id,
    data: games,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: id => dispatch(fetchRandomgames(id)),
    registerGame: (
      tournamentId,
      tableId,
      leftPLayers,
      rightPlayers,
      wereRightWinner
    ) =>
      dispatch(
        registerGame(
          tournamentId,
          tableId,
          leftPLayers,
          rightPlayers,
          wereRightWinner
        )
      ),
  };
};

const GamesInTournament = connect(
  mapStateToProps,
  mapDispatchToProps
)(Games);

export default GamesInTournament;
