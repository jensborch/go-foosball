import { types } from './tournaments';

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TOURNAMET_PLAYERS:
      const newplayers = action.players.reduce(
        (a, p) => ({
          ...a,
          [p.nickname]: p.ranking,
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

export function getPlayerRanking(state, tournament, player) {
  return state.ranking && state.ranking[tournament]
    ? state.ranking[tournament][player]
    : undefined;
}

export function getTournamentRanking(state, tournament) {
  return state.tournaments && state.tournaments[tournament]
    ? state.tournaments[tournament].initial
    : 0;
}
