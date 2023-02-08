import { useMutation, useQuery, useQueryClient } from "react-query";
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

export const usePlayers = (tournament?: number) => {
  const query = {
    ...(tournament && { exclude: tournament }),
  };
  return useQuery<Api.Player[], Error>(
    [CacheKeys.Players, tournament],
    async (): Promise<Api.Player[]> => {
      return api.players
        .playersList(query)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useGames = (tournament: string) => {
  return useQuery<Api.Game[], Error>(
    [CacheKeys.TournamentsGames, tournament],
    async (): Promise<Api.Game[]> => {
      return api.tournaments
        .gamesDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useRandomGames = (tournament: string) => {
  return useQuery<Api.Game[], Error>(
    [CacheKeys.RandomGames, tournament],
    async (): Promise<Api.Game[]> => {
      return api.tournaments
        .gamesRandomDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    },
    {
      staleTime: Infinity,
    }
  );
};

export const useTournamentPlayers = (tournament: string) => {
  return useQuery<Api.TournamentPlayer[], Error>(
    [CacheKeys.TournamentPlayers, tournament],
    async (): Promise<Api.TournamentPlayer[]> => {
      return api.tournaments
        .playersDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentHistory = (tournament: string) => {
  return useQuery<Api.TournamentHistory[], Error>(
    [CacheKeys.TournamentHistory, tournament],
    async (): Promise<Api.TournamentHistory[]> => {
      return api.tournaments
        .historyDetail(tournament, {
          from: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
        })
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const usePlayerHistory = (tournament: string, nickname: string) => {
  return useQuery<Api.TournamentPlayerHistory[], Error>(
    [CacheKeys.TournamentPlayerHistory, tournament, nickname],
    async (): Promise<Api.TournamentPlayerHistory[]> => {
      return api.tournaments
        .playersHistoryDetail(tournament, nickname, {
          from: format(sub(new Date(), { months: 1 }), "yyyy-MM-dd"),
        })
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTables = (tournament?: number) => {
  const query = {
    ...(tournament && { exclude: tournament }),
  };
  return useQuery<Api.Table[], Error>(
    [CacheKeys.Tables, tournament],
    async (): Promise<Api.Table[]> => {
      return api.tables
        .tablesList(query)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentTables = (tournament: string) => {
  return useQuery<Api.TournamentTable[], Error>(
    [CacheKeys.TournamentTables, tournament],
    async (): Promise<Api.TournamentTable[]> => {
      return api.tournaments
        .tablesDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournaments = () => {
  return useQuery<Api.Tournament[], Error>(
    CacheKeys.Tournaments,
    async (): Promise<Api.Tournament[]> => {
      return api.tournaments
        .tournamentsList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournament = (tournament: string) => {
  return useQuery<Api.Tournament, Error>(
    [CacheKeys.Tournament, tournament],
    async (): Promise<Api.Tournament> => {
      return api.tournaments
        .tournamentsDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (tournament: Api.CreateTournament) =>
      api.tournaments.tournamentsCreate(tournament),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CacheKeys.Tournaments);
        queryClient.invalidateQueries(CacheKeys.Tournament);
      },
    }
  );
};

export const useAddPlayer2Tournament = ({tournament, nickname}: {tournament: string; nickname: string}) => {
  const { mutate } = useTournamentPlayerMutation(tournament);
  return  () => mutate({
    nickname,
  });
}

export const useRemovePlayerFromTournament = ({tournament, nickname}: {tournament: string; nickname: string}) => {
  const { mutate} = useTournamentPlayerDeleteMutation(
    tournament,
    nickname
  );
  return mutate;
}


export const useTournamentPlayerMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (player: Api.AddPlayer) =>
      api.tournaments.playersCreate(tournament, player),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          CacheKeys.TournamentPlayers,
          tournament,
        ]);
        queryClient.invalidateQueries(CacheKeys.RandomGames);
        queryClient.invalidateQueries(CacheKeys.Players);
      },
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

export const useTournamentPlayerDeleteMutation = (
  tournament: string,
  nickname: string
) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => api.tournaments.playersDelete2(tournament, nickname),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          CacheKeys.TournamentPlayers,
          tournament,
        ]);
        queryClient.invalidateQueries(CacheKeys.RandomGames);
      },
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

export const useTournamentPlayersDeleteMutation = (
  tournament: string
) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => api.tournaments.playersDelete(tournament),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          CacheKeys.TournamentPlayers,
          tournament,
        ]);
        queryClient.invalidateQueries(CacheKeys.RandomGames);
      },
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

export const useTournamentTableMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (table: number) => api.tournaments.tablesCreate(tournament, { id: table }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CacheKeys.TournamentTables, tournament]);
        queryClient.invalidateQueries(CacheKeys.RandomGames);
        queryClient.invalidateQueries(CacheKeys.Tables);
      },
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

export const usePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (player: Api.CreatePlayer) => api.players.playersCreate(player),
    {
      onSuccess: () => queryClient.invalidateQueries(CacheKeys.Players),
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

export const useTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (table: Api.CreateTable) => api.tables.tablesCreate(table),
    {
      onSuccess: () => queryClient.invalidateQueries(CacheKeys.Tables),
      onError: (error) => {
        //Do nothing
      },
    }
  );
};

type GameMutationParams = {
  tournament: string;
  table: string;
  game: Api.GameResult;
};

export const useGameMutation = (tournament: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (result: GameMutationParams) =>
      api.tournaments.tablesGamesCreate(
        result.tournament,
        result.table,
        result.game
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CacheKeys.TournamentPlayers, tournament]);
        queryClient.invalidateQueries([CacheKeys.TournamentHistory, tournament]);
      },
      onError: (error) => {
        //Do nothing
      },
    }
  );
};
