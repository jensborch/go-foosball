import { actions } from '../reducers/players';
import { handleErrors, transformDateFormat } from './util';

export function fetchAllTables() {
  return function(dispatch) {
    dispatch(actions.requestAllPlayers());
    return fetch('http://localhost:8080/tables/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(actions.receiveAllPlayers(json));
      });
  };
}

export function createTables(nickname, realname) {
  return function(dispatch) {
    return fetch('http://localhost:8080/tables/', {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        nickname,
        realname,
      }),
    })
      .then(handleErrors)
      .then(response => dispatch(actions.addPlayer(nickname, realname)));
  };
}
