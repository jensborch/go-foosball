export const types = {
  REQUEST_TOURNAMETS: 'TOURNAMETS/REQUEST_TOURNAMETS',
  RECEIVE_TOURNAMETS: 'TOURNAMETS/RECEIVE_TOURNAMETS',
  REQUEST_TOURNAMET_PLAYERS: 'TOURNAMETS/REQUEST_TOURNAMET_PLAYERS',
  RECEIVE_TOURNAMET_PLAYERS: 'TOURNAMETS/RECEIVE_TOURNAMET_PLAYERS',
  ACTIVATE_TOURNAMET_PLAYER: 'TOURNAMETS/ACTIVATE_TOURNAMET_PLAYER',
  DEACTIVATE_TOURNAMET_PLAYER: 'TOURNAMETS/DEACTIVATE_TOURNAMET_PLAYER',
};
export const actions = {
  requestTournaments: () => ({ type: types.REQUEST_TOURNAMETS }),
  receiveTournaments: tournaments => ({
    type: types.RECEIVE_TOURNAMETS,
    tournaments: tournaments,
    receivedAt: Date.now(),
  }),
  requestTournamentPlayers: id => ({
    type: types.REQUEST_TOURNAMET_PLAYERS,
    id: id,
  }),
  receiveTournamentPlayers: (id, players) => ({
    type: types.RECEIVE_TOURNAMET_PLAYERS,
    id: id,
    players: players,
    receivedAt: Date.now(),
  }),
  activateTournamentPlayer: (tournamentId, playerId) => ({
    type: types.ACTIVATE_TOURNAMET_PLAYER,
    tournamentId: tournamentId,
    playerId: playerId,
  }),
  deactivateTournamentPlayer: (tournamentId, playerId) => ({
    type: types.DEACTIVATE_TOURNAMET_PLAYER,
    tournamentId: tournamentId,
    playerId: playerId,
  }),
};

export default (state = [], action) => {
  switch (action.type) {
    case types.RECEIVE_TOURNAMETS:
      const tournaments = action.tournaments.reduce(
        (a, t) => ({
          ...a,
          [t.uuid]: t,
        }),
        {}
      );
      return tournaments;
    default:
      return state;
  }
};
