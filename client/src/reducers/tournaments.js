export const types = {
  REQUEST_TOURNAMETS: 'TOURNAMETS/REQUEST_TOURNAMETS',
  RECEIVE_TOURNAMETS: 'TOURNAMETS/RECEIVE_TOURNAMETS',
  CREATE_TOURNAMET: 'TOURNAMETS/CREATE_TOURNAMET',
  REQUEST_TOURNAMET_PLAYERS: 'TOURNAMETS/REQUEST_TOURNAMET_PLAYERS',
  REQUEST_TOURNAMET_TABLES: 'TOURNAMETS/REQUEST_TOURNAMET_TABLES',
  RECEIVE_TOURNAMET_PLAYERS: 'TOURNAMETS/RECEIVE_TOURNAMET_PLAYERS',
  RECEIVE_TOURNAMET_TABLES: 'TOURNAMETS/RECEIVE_TOURNAMET_TABLES',
  RECEIVE_TOURNAMET: 'TOURNAMETS/RECEIVE_TOURNAMET',
  ACTIVATE_TOURNAMET_PLAYER: 'TOURNAMETS/ACTIVATE_TOURNAMET_PLAYER',
  DEACTIVATE_TOURNAMET_PLAYER: 'TOURNAMETS/DEACTIVATE_TOURNAMET_PLAYER',
  ACTIVATE_TOURNAMET_TABLE: 'TOURNAMETS/ACTIVATE_TOURNAMET_TABLE',
  DEACTIVATE_TOURNAMET_TABLE: 'TOURNAMETS/DEACTIVATE_TOURNAMET_TABLE',
};
export const actions = {
  requestTournaments: () => ({ type: types.REQUEST_TOURNAMETS }),
  receiveTournaments: tournaments => ({
    type: types.RECEIVE_TOURNAMETS,
    tournaments,
    receivedAt: Date.now(),
  }),
  requestCreateTournament: () => ({
    type: types.CREATE_TOURNAMET,
    receivedAt: Date.now(),
  }),
  requestTournamentPlayers: id => ({
    type: types.REQUEST_TOURNAMET_PLAYERS,
    id: id,
  }),
  requestTournamentTables: id => ({
    type: types.REQUEST_TOURNAMET_TABLES,
    id: id,
  }),
  receiveTournament: id => ({
    type: types.RECEIVE_TOURNAMET,
    id,
    receivedAt: Date.now(),
  }),
  receiveTournamentPlayers: (id, players) => ({
    type: types.RECEIVE_TOURNAMET_PLAYERS,
    id,
    players,
    receivedAt: Date.now(),
  }),
  receiveTournamentTables: (id, tables) => ({
    type: types.RECEIVE_TOURNAMET_TABLES,
    id,
    tables,
    receivedAt: Date.now(),
  }),
  activateTournamentPlayer: (tournamentId, nickname, ranking) => ({
    type: types.ACTIVATE_TOURNAMET_PLAYER,
    tournamentId,
    nickname,
    ranking,
  }),
  deactivateTournamentPlayer: (tournamentId, nickname) => ({
    type: types.DEACTIVATE_TOURNAMET_PLAYER,
    tournamentId,
    nickname,
  }),
  activateTournamentTable: (tournamentId, tableId) => ({
    type: types.ACTIVATE_TOURNAMET_TABLE,
    tournamentId,
    tableId,
  }),
  deactivateTournamentTable: (tournamentId, tableId) => ({
    type: types.DEACTIVATE_TOURNAMET_TABLE,
    tournamentId,
    tableId,
  }),
};

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_TOURNAMETS:
      return action.tournaments.reduce(
        (a, t) => ({
          ...a,
          [t.uuid]: t,
        }),
        {}
      );
    case types.RECEIVE_TOURNAMET_TABLES:
      return {
        ...state,
        tables: action.tables.reduce(
          (a, t) => [
            ...a,
            {
              uuid: t.table.uuid,
              name: t.table.name,
              color: {
                right: t.table.color.right,
                left: t.table.color.left,
              },
            },
          ],
          []
        ),
      };
    default:
      return state;
  }
};

export function getTournaments(state) {
  return state.tournaments;
}

export function getTables(state) {
  return state.tournaments.tables;
}
