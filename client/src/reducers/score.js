import { types } from './tournaments';

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TOURNAMET_PLAYERS:
      const newplayers = action.players.reduce(
        (a, p) => ({
          ...a,
          [p.nickname]: p.score,
        }),
        {}
      );
      return {
        ...state,
        [action.id]: newplayers,
      };
    default:
      return state;
  }
};

export function getPlayerScore(state, tournament, player) {
  return state.score && state.score[tournament]
    ? state.score[tournament][player]
    : undefined;
}

export function getTournamentScore(state, tournament) {
  return state.tournaments && state.tournaments[tournament]
    ? state.tournaments[tournament].initial
    : undefined;
}
