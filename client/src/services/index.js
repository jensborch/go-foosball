import { fetchRandomgames, registerGame } from "./games";
import { fetchAllPlayers, createPlayer } from "./players";
import { fetchAllTables, createTable } from "./tables";
import {
  activatePlayer,
  deactivatePlayer,
  fetchTournaments,
  fetchTournamentPlayers,
  createTournament,
  activateTable,
  deactivateTable,
  fetchTournamentTables,
} from "./tournaments";

export {
  createPlayer,
  fetchRandomgames,
  fetchAllPlayers,
  activatePlayer,
  deactivatePlayer,
  fetchTournaments,
  fetchTournamentPlayers,
  fetchAllTables,
  createTable,
  createTournament,
  activateTable,
  deactivateTable,
  fetchTournamentTables,
  registerGame,
};
