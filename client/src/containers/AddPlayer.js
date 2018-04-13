import { connect } from 'react-redux';
import AddPlayersComponent from '../components/AddPlayers';

const mapStateToProps = (state, props) => {
  const players = state.players[props.id];
  return {
    data: players ? players : [],
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const AddPlayers = connect(mapStateToProps, mapDispatchToProps)(
  AddPlayersComponent
);

export default AddPlayers;
