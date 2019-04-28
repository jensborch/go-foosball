import { connect } from 'react-redux';
import AddTableDialogComponent from '../components/AddTableDialog';
import { fetchAllTables, createTable, activateTable } from './../services';

const mapStateToProps = (state, props) => {
  return {
    tables: Object.keys(state.tables).map(id => ({ ...state.tables[id] })),
    tournamentId: props.tournamentId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTable: (tournamentId, table) => {
      dispatch(activateTable(tournamentId, table));
    },
    fetch: () => {
      dispatch(fetchAllTables());
    },
    createTable: (name, right, left) => {
      dispatch(createTable(name, right, left));
    },
  };
};

const AddTableDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTableDialogComponent);

export default AddTableDialog;
