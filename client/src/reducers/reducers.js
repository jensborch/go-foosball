import { combineReducers } from 'redux';

import {
  RECEIVE_TOURNAMETS,
  RECEIVE_TOURNAMET_PLAYERS,
} from '../actions/actions';

export function tournaments(state = [], action) {
  switch (action.type) {
    case RECEIVE_TOURNAMETS:
      return action.tournaments;
    default:
      return state;
  }
}

export function players(state = new Map(), action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      let players = new Map(action.players.map(p => [p.nickname, p]));
      return new Map([...state, ...players]);
    default:
      return state;
  }
}

export function active(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      const names = action.players.map(p => p.nickname);
      return {
        ...state,
        [action.id]: names
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  tournaments,
  players,
  active,
});

export default rootReducer;
