import { connect } from 'react-redux';
import { fetchRandomgames } from '../actions/actions';
import Refresh from '../components/Refresh';

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
    refresh: id => dispatch(fetchRandomgames(id)),
  };
};

const GamesInTournament = connect(mapStateToProps, mapDispatchToProps)(Refresh);

export default GamesInTournament;
