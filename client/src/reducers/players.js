import { types as tournamentsTypes } from './tournaments';
export const types = {
  RECEIVE_ALL_PLAYERS: 'PLAYERS/RECEIVE_ALL_PLAYERS',
  REQUEST_ALL_PLAYERS: 'PLAYERS/REQUEST_ALL_PLAYERS',
};

export const actions = {
  receiveAllPlayers: players => ({
    type: tournamentsTypes.RECEIVE_TOURNAMET_PLAYERS,
    players: players,
    receivedAt: Date.now(),
  }),
  requestAllPlayers: _ => ({
    type: tournamentsTypes.REQUEST_TOURNAMET_PLAYERS,
  }),
};

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_ALL_PLAYERS:
    case tournamentsTypes.RECEIVE_TOURNAMET_PLAYERS:
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
};
