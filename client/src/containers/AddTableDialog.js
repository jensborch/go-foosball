import { connect } from 'react-redux';
import AddTableDialogComponent from '../components/AddTableDialog';
import { fetchAllTables, createTable } from './../services';

const mapStateToProps = (state, props) => {
  return {
    tables: Object.keys(state.tables).map(id => ({ ...state.tables[id] })),
    tournament: props.tournament,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTable: (tournament, table) => {
      dispatch(createTable(tournament, table));
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
