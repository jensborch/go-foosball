import { connect } from 'react-redux';
import Players from '../components/Players';
import { fetchTournamentPlayers } from '../actions/actions';

const mapStateToProps = (state, props) => {
  return {
    id: props.id,
    data: state.players,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: id => dispatch(fetchTournamentPlayers(id)),
  };
};

const TournamentPlayers = connect(mapStateToProps, mapDispatchToProps)(Players);

export default TournamentPlayers;
