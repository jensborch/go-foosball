import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Api from "../api/Api";
import { api, handleErrors } from "./util";
import { format, sub } from "date-fns";

export enum CacheKeys {
  Players = "Players",
  TournamentsGames = "TournamentsGames",
  RandomGames = "RandomGames",
  TournamentPlayers = "TournamentPlayers",
  Tables = "Tables",
  TournamentTables = "TournamentTables",
  Tournaments = "Tournaments",
  Tournament = "Tournament",
  TournamentHistory = "TournamentHistory",
  TournamentPlayerHistory = "TournamentPlayerHistory",
}

export const usePlayers = (tournament: number) => {
  return useQuery<Api.Player[], Error>({
    queryKey: [CacheKeys.Players, tournament],
    queryFn: async () => {
      const query = { exclude: tournament };
      return api.players
        .playersList(query)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useGames = (tournament: string) => {
  return useQuery<Api.Game[], Error>({
    queryKey: [CacheKeys.TournamentsGames, tournament],
    queryFn: async () => {
      return api.tournaments
        .gamesDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useRandomGames = (tournament: string) => {
  return useQuery<Api.Game[], Error>({
    queryKey: [CacheKeys.RandomGames, tournament],
    queryFn: async () => {
      return api.tournaments
        .gamesRandomDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
    staleTime: Infinity,
  });
};

export const useTournamentPlayers = (tournament: string) => {
  return useQuery<Api.TournamentPlayer[], Error>({
    queryKey: [CacheKeys.TournamentPlayers, tournament],
    queryFn: async (): Promise<Api.TournamentPlayer[]> => {
      return api.tournaments
        .playersDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTournamentHistory = (tournament: string) => {
  return useQuery<Api.TournamentHistory[], Error>({
    queryKey: [CacheKeys.TournamentHistory, tournament],
    queryFn: async (): Promise<Api.TournamentHistory[]> => {
      return api.tournaments
        .historyDetail(tournament, {
          from: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
        })
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const usePlayerHistory = (tournament: string, nickname: string) => {
  return useQuery<Api.TournamentPlayerHistory[], Error>({
    queryKey: [CacheKeys.TournamentPlayerHistory, tournament, nickname],
    queryFn: async (): Promise<Api.TournamentPlayerHistory[]> => {
      return api.tournaments
        .playersHistoryDetail(tournament, nickname, {
          from: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
        })
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTables = (tournament?: number) => {
  const query = {
    ...(tournament && { exclude: tournament }),
  };
  return useQuery<Api.Table[], Error>({
    queryKey: [CacheKeys.Tables, tournament],
    queryFn: async (): Promise<Api.Table[]> => {
      return api.tables
        .tablesList(query)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTournamentTables = (tournament: string) => {
  return useQuery<Api.TournamentTable[], Error>({
    queryKey: [CacheKeys.TournamentTables, tournament],
    queryFn: async (): Promise<Api.TournamentTable[]> => {
      return api.tournaments
        .tablesDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTournaments = () => {
  return useQuery<Api.Tournament[], Error>({
    queryKey: [CacheKeys.Tournaments],
    queryFn: async (): Promise<Api.Tournament[]> => {
      return api.tournaments
        .tournamentsList()
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTournament = (tournament: string) => {
  return useQuery<Api.Tournament, Error>({
    queryKey: [CacheKeys.Tournament, tournament],
    queryFn: async (): Promise<Api.Tournament> => {
      return api.tournaments
        .tournamentsDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
  });
};

export const useTournamentMutation = () => {
  return useMutation({
    mutationFn: (tournament: Api.CreateTournament) =>
      api.tournaments.tournamentsCreate(tournament),
    onSuccess: () => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Tournaments] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Tournament] });
    },
  });
};

export const useAddPlayer2Tournament = ({
  tournament,
  nickname,
}: {
  tournament: string;
  nickname: string;
}) => {
  const { mutate } = useTournamentPlayerMutation(tournament);
  return () => mutate({ nickname });
};

export const useRemovePlayerFromTournament = ({
  tournament,
  nickname,
}: {
  tournament: string;
  nickname: string;
}) => {
  const { mutate } = useTournamentPlayerDeleteMutation(tournament, nickname);
  return mutate;
};

export const useTournamentPlayerMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (player: Api.AddPlayer) =>
      api.tournaments.playersCreate(tournament, player),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentPlayers, tournament],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.RandomGames] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Players] });
    },
    onError: () => {
      //Do nothing
    },
  });
};

export const useTournamentPlayerDeleteMutation = (
  tournament: string,
  nickname: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.tournaments.playersDelete2(tournament, nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentPlayers, tournament],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.RandomGames] });
    },
    onError: () => {
      //Do nothing
    },
  });
};

export const useTournamentPlayersDeleteMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.tournaments.playersDelete(tournament),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentPlayers, tournament],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.RandomGames] });
    },
    onError: () => {
      //Do nothing
    },
  });
};

export const useTournamentTableMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (table: number) =>
      api.tournaments.tablesCreate(tournament, { id: table }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentTables, tournament],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.RandomGames] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Tables] });
    },
    onError: () => {
      //Do nothing
    },
  });
};

export const usePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (player: Api.CreatePlayer) => api.players.playersCreate(player),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Players] }),
    onError: () => {
      //Do nothing
    },
  });
};

export const useTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (table: Api.CreateTable) => api.tables.tablesCreate(table),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [CacheKeys.Tables] }),
    onError: () => {
      //Do nothing
    },
  });
};

type GameMutationParams = {
  tournament: string;
  table: string;
  game: Api.GameResult;
};

export const useGameMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (result: GameMutationParams) =>
      api.tournaments.tablesGamesCreate(
        result.tournament,
        result.table,
        result.game
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentPlayers, tournament],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.TournamentHistory, tournament],
      });
    },
    onError: () => {
      //Do nothing
    },
  });
};
