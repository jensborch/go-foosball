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

export function fetchTournaments() {
  return function(dispatch) {
    dispatch(requestTournaments());
    return fetch('http://localhost:8080/tournaments/')
      .then(response => response.json())
      .then(json => {
        dispatch(receiveTournaments(json));
      });
  };
}
