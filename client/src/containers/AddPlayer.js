import { connect } from 'react-redux';
import AddPlayersComponent from '../components/AddPlayers';

const mapStateToProps = state => {
  const players = [];
  Object.keys(state.players).forEach(id => {
    players.push(state.players[id]);
  });
  return {
    data: players,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const AddPlayers = connect(mapStateToProps, mapDispatchToProps)(
  AddPlayersComponent
);

export default AddPlayers;
