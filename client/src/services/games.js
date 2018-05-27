import { actions } from '../reducers/random';
import { handleErrors, transformDateFormat } from './util';

export function fetchRandomgames(id) {
  return function(dispatch) {
    return fetch(`http://localhost:8080/tournaments/${id}/games/random`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(actions.receiveRandomGames(id, json));
      });
  };
}
