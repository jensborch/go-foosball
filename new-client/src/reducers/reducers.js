import { combineReducers } from 'redux';

import { RECEIVE_TOURNAMETS } from '../actions/actions';

export const tournaments = (
  state = {
    tournaments: [],
  },
  action
) => {
  switch (action.type) {
    case RECEIVE_TOURNAMETS:
      return Object.assign({}, state, {
        tournaments: action.tournaments,
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  tournaments,
});

export default rootReducer;
