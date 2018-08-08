import { types } from './tournaments';

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TOURNAMET_PLAYERS:
      return {
        ...state,
        [action.id]: action.players.filter(p => p.active).map(p => p.nickname),
      };
    case types.ACTIVATE_TOURNAMET_PLAYER:
      return {
        ...state,
        [action.tournamentId]: [...state[action.tournamentId], action.nickname],
      };
    case types.DEACTIVATE_TOURNAMET_PLAYER:
      let newstate = { ...state };
      const i = newstate[action.tournamentId].indexOf(action.nickname);
      if (i > -1) {
        newstate[action.tournamentId].splice(i, 1);
      }
      return newstate;
    default:
      return state;
  }
};
