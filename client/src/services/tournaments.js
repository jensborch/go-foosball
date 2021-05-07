import { actions } from '../reducers/tournaments';
import { handleErrors, transformDateFormat } from './util';

export const fetchTournaments = () => {
  return (dispatch) => {
    dispatch(actions.requestTournaments());
    return fetch('http://localhost:8080/tournaments/')
      .then(handleErrors)
      .then((response) => response.json())
      .then((json) => json.map(transformDateFormat))
      .then((json) => {
        dispatch(actions.receiveTournaments(json));
      });
  };
};

export function fetchTournamentPlayers(id) {
  return function (dispatch) {
    dispatch(actions.requestTournamentPlayers(id));
    return fetch(`http://localhost:8080/tournaments/${id}/players`)
      .then(handleErrors)
      .then((response) => response.json())
      .then((json) => {
        dispatch(actions.receiveTournamentPlayers(id, json));
      });
  };
}

export function fetchTournamentTables(id) {
  return function (dispatch) {
    dispatch(actions.requestTournamentTables(id));
    return fetch(`http://localhost:8080/tournaments/${id}/tables`)
      .then(handleErrors)
      .then((response) => response.json())
      .then((json) => {
        dispatch(actions.receiveTournamentTables(id, json));
      });
  };
}

export function createTournament(name, score, initial) {
  return function (dispatch) {
    dispatch(actions.requestCreateTournament());
    return fetch(`http://localhost:8080/tournaments/`, {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        name,
        score: parseInt(score),
        initial: parseInt(initial),
      }),
    })
      .then(handleErrors)
      .then((response) => fetchTournaments());
  };
}

export function activatePlayer(tournamentId, nickname, ranking) {
  return function (dispatch) {
    return fetch(`http://localhost:8080/tournaments/${tournamentId}/players`, {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        nickname,
        ranking,
      }),
    })
      .then(handleErrors)
      .then((response) =>
        dispatch(
          actions.activateTournamentPlayer(tournamentId, nickname, ranking)
        )
      );
  };
}

export function deactivatePlayer(tournamentId, playerId) {
  return function (dispatch) {
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/players/${playerId}`,
      {
        method: 'DELETE',
      }
    )
      .then(handleErrors)
      .then((response) =>
        dispatch(actions.deactivateTournamentPlayer(tournamentId, playerId))
      );
  };
}

export function activateTable(tournamentId, tableId) {
  return function (dispatch) {
    return fetch(`http://localhost:8080/tournaments/${tournamentId}/tables`, {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        uuid: tableId,
      }),
    })
      .then(handleErrors)
      .then((response) =>
        dispatch(actions.activateTournamentTable(tournamentId, tableId))
      );
  };
}

export function deactivateTable(tournamentId, tableId) {
  return function (dispatch) {
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/tables/${tableId}`,
      {
        method: 'DELETE',
      }
    )
      .then(handleErrors)
      .then((response) =>
        dispatch(actions.deactivateTournamentTable(tournamentId, tableId))
      );
  };
}
