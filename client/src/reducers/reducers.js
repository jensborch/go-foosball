import { combineReducers } from 'redux';

import {
  RECEIVE_TOURNAMETS,
  RECEIVE_TOURNAMET_PLAYERS,
} from '../actions/actions';

function tournaments(state = [], action) {
  switch (action.type) {
    case RECEIVE_TOURNAMETS:
      return action.tournaments;
    default:
      return state;
  }
}

function players(state = new Map(), action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      let players = new Map(action.players.map(p => [p.nickname, p]));
      return players;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  tournaments,
  players,
});

export default rootReducer;
