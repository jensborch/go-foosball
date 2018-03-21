import { connect } from 'react-redux';
import { fetchRandomgames } from '../actions/actions';
import Refresh from '../components/Refresh';

const mapStateToProps = (state, props) => {
  return {
    id: props.id,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: id => dispatch(fetchRandomgames(id)),
  };
};

const RandomGames = connect(mapStateToProps, mapDispatchToProps)(Refresh);

export default RandomGames;
