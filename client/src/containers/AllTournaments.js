import { connect } from 'react-redux';
import Tournaments from '../components/Tournaments';
import { fetchTournaments, createTournament } from '../services';
import Refresh from '../components/Refresh';
import { getTournaments } from '../reducers/tournaments';

const mapStateToProps = (state) => {
  return {
    data: getTournaments(state),
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetch: () => {
    dispatch(fetchTournaments());
  },
  createTournament: (name, score, initial) => {
    dispatch(createTournament(name, score, initial));
  },
});

const AllTournaments = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tournaments);

export default AllTournaments;

export const RefreshTournaments = connect(null, mapDispatchToProps)(Refresh);
