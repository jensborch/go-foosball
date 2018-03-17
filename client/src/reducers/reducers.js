import { combineReducers } from 'redux';

import {
  RECEIVE_TOURNAMETS,
  RECEIVE_TOURNAMET_PLAYERS,
  RECEIVE_RANDOM_GAMES,
} from '../actions/actions';

export function tournaments(state = [], action) {
  switch (action.type) {
    case RECEIVE_TOURNAMETS:
      return action.tournaments;
    default:
      return state;
  }
}

export function players(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      const newplayers = action.players.reduce(
        (a, p) => ({ ...a, [p.nickname]: p }),
        {}
      );
      return {
        ...state,
        ...newplayers,
      };
    default:
      return state;
  }
}

export function active(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      return {
        ...state,
        [action.id]: action.players.map(p => p.nickname),
      };
    default:
      return state;
  }
}

export function random(state = {}, action) {
  switch (action.type) {
    case RECEIVE_RANDOM_GAMES:
      return {
        ...state,
        [action.id]: action.games,
      };
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
