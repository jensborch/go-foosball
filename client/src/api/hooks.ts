import { useQuery } from "react-query";
import * as Api from "../api/Api";
import { api, handleErrors } from "../api/Util";

export const usePlayers = () => {
  return useQuery<Api.Player[], Error>(
    "players",
    async (): Promise<Api.Player[]> => {
      return api.players
        .playersList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTables = () => {
  return useQuery<Api.Table[], Error>(
    "tables",
    async (): Promise<Api.Table[]> => {
      return api.tables
        .tablesList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournaments = () => {
  return useQuery<Api.Tournament[], Error>(
    "tournaments",
    async (): Promise<Api.Tournament[]> => {
      return api.tournaments
        .tournamentsList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};
