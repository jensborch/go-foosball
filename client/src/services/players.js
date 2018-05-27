import { actions } from '../reducers/players';
import { handleErrors, transformDateFormat } from './util';

export function fetchAllPlayers() {
  return function(dispatch) {
    dispatch(actions.requestAllPlayers());
    return fetch('http://localhost:8080/players/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(actions.receiveAllPlayers(json));
      });
  };
}
