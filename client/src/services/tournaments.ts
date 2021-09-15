import { handleErrors, transformDateFormat } from "./util";

export interface Tournament {
  created: Date;
  name: string;
  score: number;
  uuid: string;
  initial: number;
}

export type Tournaments = Tournament[];

export function fetchTournaments<Tournaments>(): Promise<Tournaments> {
  return fetch("http://localhost:8080/tournaments/")
    .then(handleErrors)
    .then((response) => response.json())
    .then((json) => json.map(transformDateFormat) as Promise<Tournaments>);
}

export interface Player {}

export type Players = Player[];

export function fetchTournamentPlayers(id: string): Promise<Players> {
  return fetch(`http://localhost:8080/tournaments/${id}/players`)
    .then(handleErrors)
    .then((response) => response.json() as Promise<Players>);
}

export interface Table {}

export type Tables = Table[];

export function fetchTournamentTables(id: string): Promise<Tables> {
  return fetch(`http://localhost:8080/tournaments/${id}/tables`)
    .then(handleErrors)
    .then((response) => response.json() as Promise<Tables>);
}

export function createTournament(name: string, score: string, initial: string) {
  return fetch(`http://localhost:8080/tournaments/`, {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name,
      score: parseInt(score),
      initial: parseInt(initial),
    }),
  })
    .then(handleErrors)
    .then((response) => fetchTournaments());
}

export function activatePlayer(
  tournamentId: string,
  nickname: string,
  ranking: number
) {
  return fetch(`http://localhost:8080/tournaments/${tournamentId}/players`, {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      nickname,
      ranking,
    }),
  }).then(handleErrors);
}

export function deactivatePlayer(tournamentId: string, playerId: string) {
  return fetch(
    `http://localhost:8080/tournaments/${tournamentId}/players/${playerId}`,
    {
      method: "DELETE",
    }
  ).then(handleErrors);
}

export function activateTable(tournamentId: string, tableId: string) {
  return fetch(`http://localhost:8080/tournaments/${tournamentId}/tables`, {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      uuid: tableId,
    }),
  }).then(handleErrors);
}

export function deactivateTable(tournamentId: string, tableId: string) {
  return fetch(
    `http://localhost:8080/tournaments/${tournamentId}/tables/${tableId}`,
    {
      method: "DELETE",
    }
  ).then(handleErrors);
}
