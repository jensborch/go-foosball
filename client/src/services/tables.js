import { actions } from '../reducers/tables';
import { handleErrors, transformDateFormat } from './util';

export function fetchAllTables() {
  return function(dispatch) {
    dispatch(actions.requestAllTables());
    return fetch('http://localhost:8080/tables/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(actions.receiveAllTables(json));
      });
  };
}

export function createTable(name, right, left) {
  return function(dispatch) {
    return fetch('http://localhost:8080/tables/', {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        name,
        color: { right, left },
      }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(json => transformDateFormat(json))
      .then(response =>
        dispatch(actions.addTable(response.uuid, name, right, left))
      );
  };
}
