export const types = {
  RECEIVE_ALL_TABLES: 'TABLES/RECEIVE_ALL_TABLES',
  REQUEST_ALL_TABLES: 'TABLES/REQUEST_ALL_TABLES',
  ADD_TABLE: 'TABLERS/ADD_TABLES',
};

export const actions = {
  receiveAllTables: tables => ({
    type: types.RECEIVE_ALL_TABLES,
    tables,
    receivedAt: Date.now(),
  }),
  requestAllTables: () => ({
    type: types.REQUEST_ALL_TABLES,
  }),
  addTable: (name, right, left) => ({
    type: types.ADD_TABLE,
    name,
    color: { right: right, left: left },
  }),
};

export default (state = {}, action) => {
  switch (action.type) {
    case types.RECEIVE_ALL_TABLES:
      const newTables = action.tables.reduce(
        (a, t) => ({
          ...a,
          [t.uuid]: {
            uuid: t.uuid,
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
    case types.ADD_TABLE:
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

export function getTable(state, id) {
  return state.tables[id];
}

export function getTables(state) {
  return state.tables;
}
