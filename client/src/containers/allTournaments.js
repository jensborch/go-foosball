import { connect } from 'react-redux';
import Tournaments from '../components/Tournaments';
import { fetchTournaments } from '../actions/actions';

const mapStateToProps = state => {
  return {
    data: state.tournaments,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchTournaments: () => dispatch(fetchTournaments()),
  };
};

const AllTournaments = connect(mapStateToProps, mapDispatchToProps)(
  Tournaments
);

export default AllTournaments;
