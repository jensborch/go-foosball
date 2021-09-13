export const types = {
  REGISTERED_GAME: 'GAMES/REGISTERED_GAME',
};

export const actions = {
  registerGame: (json) => ({
    type: types.REGISTERED_GAME,
    json,
    receivedAt: Date.now(),
  }),
};

export default (state = {}, action) => {
  switch (action.type) {
    case types.REGISTERED_GAME:
      return {
        ...state,
        [action.json.uuid]: action.json,
      };
    default:
      return state;
  }
};
