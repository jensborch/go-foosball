import { actions } from '../reducers/random';
import { actions as gameActions } from '../reducers/games';
import { handleErrors, transformDateFormat } from './util';

export function fetchRandomgames(id) {
  return function (dispatch) {
    return fetch(`http://localhost:8080/tournaments/${id}/games/random`)
      .then(handleErrors)
      .then((response) => response.json())
      .then((json) => json.map(transformDateFormat))
      .then((json) => {
        dispatch(actions.receiveRandomGames(id, json));
      });
  };
}

export function registerGame(
  tournamentId,
  tableId,
  leftPLayers,
  rightPlayers,
  wereRightWinner
) {
  return function (dispatch) {
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/tables/${tableId}/games`,
      {
        method: 'POST',
        redirect: 'follow',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          leftPLayers,
          rightPlayers,
          winner: wereRightWinner ? 'RIGHT' : 'LEFT',
        }),
      }
    )
      .then(handleErrors)
      .then((response) => response.json())
      .then((json) => transformDateFormat(json))
      .then((json) => {
        dispatch(gameActions.registerGame(json));
      });
  };
}
