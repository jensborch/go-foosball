import { combineReducers } from 'redux';

import {
  RECEIVE_TOURNAMETS,
  RECEIVE_TOURNAMET_PLAYERS,
} from '../actions/actions';

export const tournaments = (
  state = {
    tournaments: [],
    tournamentPlayers: {},
  },
  action
) => {
  switch (action.type) {
    case RECEIVE_TOURNAMETS:
      return Object.assign({}, state, {
        tournaments: action.tournaments,
      });
    case RECEIVE_TOURNAMET_PLAYERS:
      let players = new Map(action.players.map(p => [p.nickname, p]));
      return Object.assign({}, state, {
        tournamentPlayers: players,
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  tournaments,
});

export default rootReducer;
