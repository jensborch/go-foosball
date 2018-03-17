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
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(receiveTournamentPlayers(id, json));
      });
  };
}

export function fetchRandomgames(id) {
  return function(dispatch) {
    return fetch(`http://localhost:8080/tournaments/${id}/games/random`)
      .then(response => response.json())
      .then(json => json.map(transformDateFormat))
      .then(json => {
        dispatch(receiveRandomGames(id, json));
      });
  };
}
