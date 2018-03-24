export const REQUEST_TOURNAMETS = 'REQUEST_TOURNAMETS';
export const requestTournaments = () => {
  return {
    type: REQUEST_TOURNAMETS,
  };
};

export const RECEIVE_TOURNAMETS = 'RECEIVE_TOURNAMETS';
export const receiveTournaments = tournaments => {
  return {
    type: RECEIVE_TOURNAMETS,
    tournaments: tournaments,
    receivedAt: Date.now(),
  };
};

export const REQUEST_TOURNAMET_PLAYERS = 'REQUEST_TOURNAMET_PLAYERS';
export const requestTournamentPlayers = id => {
  return {
    type: REQUEST_TOURNAMET_PLAYERS,
    id: id,
  };
};

export const RECEIVE_TOURNAMET_PLAYERS = 'RECEIVE_TOURNAMET_PLAYERS';
export const receiveTournamentPlayers = (id, players) => {
  return {
    type: RECEIVE_TOURNAMET_PLAYERS,
    id: id,
    players: players,
    receivedAt: Date.now(),
  };
};

export const ACTIVATE_TOURNAMET_PLAYER = 'ACTIVATE_TOURNAMET_PLAYER';
export const activateTournamentPlayer = (tournamentId, playerId) => {
  return {
    type: ACTIVATE_TOURNAMET_PLAYER,
    tournamentId: tournamentId,
    playerId: playerId,
  };
};

export const DEACTIVATE_TOURNAMET_PLAYER = 'DEACTIVATE_TOURNAMET_PLAYER';
export const deactivateTournamentPlayer = (tournamentId, playerId) => {
  return {
    type: DEACTIVATE_TOURNAMET_PLAYER,
    tournamentId: tournamentId,
    playerId: playerId,
  };
};

export const RECEIVE_RANDOM_GAMES = 'RECEIVE_RANDOM_GAMES';
export const receiveRandomGames = (id, games) => {
  return {
    type: RECEIVE_RANDOM_GAMES,
    id: id,
    games: games,
    receivedAt: Date.now(),
  };
};

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
    dispatch(requestTournaments());
    return fetch('http://localhost:8080/tournaments/')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(receiveTournaments(json));
      });
  };
}

export function fetchTournamentPlayers(id) {
  return function(dispatch) {
    dispatch(requestTournamentPlayers(id));
    return fetch(`http://localhost:8080/tournaments/${id}/players`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(receiveTournamentPlayers(id, json));
      });
  };
}

export function activatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(requestTournaments());
    return fetch(`http://localhost:8080/tournaments/${tournamentId}/players/`, {
      method: 'POST',
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
        dispatch(activateTournamentPlayer(tournamentId, playerId))
      );
  };
}

export function deactivatePlayer(tournamentId, playerId) {
  return function(dispatch) {
    dispatch(requestTournaments());
    return fetch(
      `http://localhost:8080/tournaments/${tournamentId}/players/${playerId}`,
      {
        method: 'DELETE',
      }
    )
      .then(handleErrors)
      .then(response =>
        dispatch(deactivateTournamentPlayer(tournamentId, playerId))
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
        dispatch(receiveRandomGames(id, json));
      });
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
