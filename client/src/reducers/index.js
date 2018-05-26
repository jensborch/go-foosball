import { combineReducers } from 'redux';
import tournaments from './tournaments';
import players from './players';
import active from './active';
import inactive from './inactive';
import random from './random';

const rootReducer = combineReducers({
  tournaments,
  players,
  active,
  inactive,
  random,
});
export default rootReducer;

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
