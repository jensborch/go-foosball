import { connect } from 'react-redux';
import AddTableDialogComponent from '../components/AddTableDialog';
import { fetchAllTables, createTable } from './../services';

const mapStateToProps = (state, props) => {
  return {
    tables: Array.from(state.tables),
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
  };
};

const AddTableDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTableDialogComponent);

export default AddTableDialog;
