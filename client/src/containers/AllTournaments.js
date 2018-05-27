import { connect } from 'react-redux';
import Tournaments from '../components/Tournaments';
import { fetchTournaments } from '../actions/actions';
import Refresh from '../components/Refresh';

const mapStateToProps = state => {
  debugger;
  return {
    data: state.tournaments,
  };
};
const mapDispatchToProps = dispatch => ({
  fetch: () => dispatch(fetchTournaments()),
});

const AllTournaments = connect(mapStateToProps, mapDispatchToProps)(
  Tournaments
);

export default AllTournaments;

export const RefreshTournaments = connect(null, mapDispatchToProps)(Refresh);
