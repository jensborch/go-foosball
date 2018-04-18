import { combineReducers } from 'redux';

import {
  RECEIVE_TOURNAMETS,
  RECEIVE_TOURNAMET_PLAYERS,
  ACTIVATE_TOURNAMET_PLAYER,
  DEACTIVATE_TOURNAMET_PLAYER,
  RECEIVE_RANDOM_GAMES,
  RECEIVE_ALL_PLAYERS,
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
    case RECEIVE_ALL_PLAYERS:
    case RECEIVE_TOURNAMET_PLAYERS:
      const newplayers = action.players.reduce(
        (a, p) => ({
          ...a,
          [p.nickname]: {
            nickname: p.nickname,
            realname: p.realname,
          },
        }),
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
        [action.id]: action.players.filter(p => p.active).map(p => p.nickname),
      };
    case ACTIVATE_TOURNAMET_PLAYER:
      return {
        ...state,
        [action.tournamentId]: [...state[action.tournamentId], action.playerId],
      };
    case DEACTIVATE_TOURNAMET_PLAYER:
      let newstate = { ...state };
      const i = newstate[action.tournamentId].indexOf(action.playerId);
      if (i > -1) {
        newstate[action.tournamentId].splice(i, 1);
      }
      return newstate;
    default:
      return state;
  }
}

export function inactive(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOURNAMET_PLAYERS:
      return {
        ...state,
        [action.id]: action.players.filter(p => !p.active).map(p => p.nickname),
      };
    case DEACTIVATE_TOURNAMET_PLAYER:
      return {
        ...state,
        [action.tournamentId]: [...state[action.tournamentId], action.playerId],
      };
    case ACTIVATE_TOURNAMET_PLAYER:
      let newstate = { ...state };
      const i = newstate[action.tournamentId].indexOf(action.playerId);
      if (i > -1) {
        newstate[action.tournamentId].splice(i, 1);
      }
      return newstate;
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
  inactive,
  random,
});

export function isPlayerActive(state, tournament, player) {
  if (state.active[tournament]) {
    const p = state.active[tournament].find(p => p === player);
    return p !== undefined;
  } else {
    return false;
  }
}

export function isPlayerInactive(state, tournament, player) {
  if (state.inactive[tournament]) {
    const p = state.inactive[tournament].find(p => p === player);
    return p !== undefined;
  } else {
    return false;
  }
}

export function isInTournament(state, tournament, player) {
  return !(
    isPlayerInactive(state, tournament, player) ||
    isPlayerActive(state, tournament, player)
  );
}

export default rootReducer;
