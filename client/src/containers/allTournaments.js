import { connect } from 'react-redux';
import Tournaments from '../components/Tournaments';
import { fetchTournaments } from '../actions/actions';
import Menu from '../components/Menu';

const mapStateToProps = state => {
  return {
    data: state.tournaments,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: () => dispatch(fetchTournaments()),
  };
};

const AllTournaments = connect(mapStateToProps, mapDispatchToProps)(
  Tournaments
);

export default AllTournaments;

export const AllTournamentsMenu = connect(null, mapDispatchToProps)(Menu);
