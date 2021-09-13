import { connect } from 'react-redux';
import TournamentTablesComponent from '../components/TournamentTables';
import {
  fetchTournamentTables,
  activateTable,
  deactivateTable,
} from '../services';
import { getTables } from '../reducers/tournaments';

const mapStateToProps = (state, props) => {
  return {
    tournamentId: props.id,
    tables: getTables(state),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetch: (tournamentId) => {
      dispatch(fetchTournamentTables(tournamentId));
    },
    select: (tournamentId, tableId) =>
      dispatch(activateTable(tournamentId, tableId)),
    deselect: (tournamentId, tableId) =>
      dispatch(deactivateTable(tournamentId, tableId)),
  };
};

const TournamentTables = connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentTablesComponent);

export default TournamentTables;
