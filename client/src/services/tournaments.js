import { actions } from '../reducers/tournaments';
import { handleErrors, transformDateFormat } from './util';

export const fetchTournaments = () => {
  return dispatch => {
    dispatch(actions.requestTournaments());
    return fetch('http://localhost:8080/tournaments/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(actions.receiveTournaments(json));
      });
  };
};

export function fetchTournamentPlayers(id) {
  return function(dispatch) {
    dispatch(actions.requestTournamentPlayers(id));
    return fetch(`http://localhost:8080/tournaments/${id}/players`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => {
        dispatch(actions.receiveTournamentPlayers(id, json));
      });
  };
}

export function activatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(actions.requestTournaments());
    return fetch(`http://localhost:8080/tournaments/${tournamentId}/players`, {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        nickname: playerId,
      }),
    })
      .then(handleErrors)
      .then(response =>
        dispatch(actions.activateTournamentPlayer(tournamentId, playerId))
      );
  };
}

export function deactivatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(actions.requestTournaments());
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/players/${playerId}`,
      {
        method: 'DELETE',
      }
    )
      .then(handleErrors)
      .then(response =>
        dispatch(actions.deactivateTournamentPlayer(tournamentId, playerId))
      );
  };
}
