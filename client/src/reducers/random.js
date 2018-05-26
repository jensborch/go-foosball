export const types = {
  RECEIVE_RANDOM_GAMES: 'RANDOM/RECEIVE_RANDOM_GAMES',
};
export const actions = {
  receiveRandomGames: (id, games) => ({
    type: types.RECEIVE_RANDOM_GAMES,
    id: id,
    games: games,
    receivedAt: Date.now(),
  }),
};
export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_RANDOM_GAMES:
      return {
        ...state,
        [action.id]: action.games,
      };
    default:
      return state;
  }
};
