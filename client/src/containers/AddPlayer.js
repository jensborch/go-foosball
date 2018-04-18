import { connect } from 'react-redux';
import AddPlayersComponent from '../components/AddPlayers';
import { fetchAllPlayers } from '../actions/actions';
import { isInTournament } from '../reducers/reducers';

const mapStateToProps = (state, props) => {
  const players = [];
  Object.keys(state.players).forEach(id => {
    if (isInTournament(state, props.id, id)) {
      players.push(state.players[id]);
    }
  });
  return {
    data: players,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => dispatch(fetchAllPlayers()),
  };
};

const AddPlayers = connect(mapStateToProps, mapDispatchToProps)(
  AddPlayersComponent
);

export default AddPlayers;