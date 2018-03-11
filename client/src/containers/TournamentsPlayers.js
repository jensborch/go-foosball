import { connect } from 'react-redux';
import Players from '../components/Players';

const mapStateToProps = state => {
  return {
    id: state.id,
    data: state.players,
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};

const TournamentPlayers = connect(mapStateToProps, mapDispatchToProps)(Players);

export default TournamentPlayers;
