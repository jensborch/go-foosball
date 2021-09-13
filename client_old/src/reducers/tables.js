export const types = {
  RECEIVE_ALL_TABLES: 'TABLES/RECEIVE_ALL_TABLES',
  REQUEST_ALL_TABLES: 'TABLES/REQUEST_ALL_TABLES',
  ADD_TABLE: 'TABLERS/ADD_TABLES',
};

export const actions = {
  receiveAllTables: (tables) => ({
    type: types.RECEIVE_ALL_TABLES,
    tables,
    receivedAt: Date.now(),
  }),
  requestAllTables: () => ({
    type: types.REQUEST_ALL_TABLES,
  }),
  addTable: (uuid, name, right, left) => ({
    type: types.ADD_TABLE,
    uuid,
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
            color: {
              right: t.color.right,
              left: t.color.left,
            },
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
        [action.uuid]: {
          uuid: action.uuid,
          name: action.name,
          color: {
            right: action.color.right,
            left: action.color.left,
          },
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
