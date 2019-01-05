import { connect } from 'react-redux';
import AddTableDialogComponent from '../components/AddTableDialog';

const mapStateToProps = (state, props) => {
  const tables = [];
  return {
    tables,
    tournament: props.tournament,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTable: () => {
      // dispatch(fetchAllPlayers());
    },
  };
};

const AddTableDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTableDialogComponent);

export default AddTableDialog;
