export const types = {
  RECEIVE_ALL_TABLES: 'TABLES/RECEIVE_ALL_TABLES',
  REQUEST_ALL_TABLES: 'TABLES/REQUEST_ALL_TABLES',
  ADD_TABLE: 'TABLERS/ADD_TABLES',
};

export const actions = {
  receiveAllTables: tables => ({
    type: types.RECEIVE_ALL_TABLES,
    tables: tables,
    receivedAt: Date.now(),
  }),
  requestAllTables: () => ({
    type: types.REQUEST_ALL_TABLES,
  }),
  addTables: (name, right, left) => ({
    type: types.ADD_TABLE,
    name,
    color: { right: right, left: left },
  }),
};

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_ALL_TABLES:
      const newTables = action.players.reduce(
        (a, t) => ({
          ...a,
          [t.name]: {
            name: t.name,
            color: t.color,
          },
        }),
        {}
      );
      return {
        ...state,
        ...newTables,
      };
    case types.ADD_PLAYER:
      return {
        ...state,
        [action.name]: {
          name: action.name,
          color: action.color,
        },
      };
    default:
      return state;
  }
};

export function getTable(state, name) {
  return state.tables[name];
}
