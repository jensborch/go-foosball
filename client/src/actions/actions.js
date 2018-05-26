import { actions as tournamentActions } from '../reducers/tournaments';
import { actions as playerActions } from '../reducers/players';
import { actions as randomGameActions } from '../reducers/random';

export function transformDateFormat(json) {
  const result = {
    ...json,
    created: new Date(json.created),
    updated: new Date(json.updated),
  };
  return result;
}

export function fetchTournaments() {
  return function(dispatch) {
    dispatch(tournamentActions.requestTournaments());
    return fetch('http://localhost:8080/tournaments/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(tournamentActions.receiveTournaments(json));
      });
  };
}

export function fetchTournamentPlayers(id) {
  return function(dispatch) {
    dispatch(tournamentActions.requestTournamentPlayers(id));
    return fetch(`http://localhost:8080/tournaments/${id}/players`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => {
        dispatch(tournamentActions.receiveTournamentPlayers(id, json));
      });
  };
}

export function fetchAllPlayers() {
  return function(dispatch) {
    dispatch(playerActions.requestAllPlayers());
    return fetch('http://localhost:8080/players/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(playerActions.receiveAllPlayers(json));
      });
  };
}

export function activatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(tournamentActions.requestTournaments());
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
        dispatch(
          tournamentActions.activateTournamentPlayer(tournamentId, playerId)
        )
      );
  };
}

export function deactivatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(tournamentActions.requestTournaments());
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/players/${playerId}`,
      {
        method: 'DELETE',
      }
    )
      .then(handleErrors)
      .then(response =>
        dispatch(
          tournamentActions.deactivateTournamentPlayer(tournamentId, playerId)
        )
      );
  };
}

export function fetchRandomgames(id) {
  return function(dispatch) {
    return fetch(`http://localhost:8080/tournaments/${id}/games/random`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(randomGameActions.receiveRandomGames(id, json));
      });
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
