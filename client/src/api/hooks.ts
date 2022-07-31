import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as Api from '../api/Api';
import { api, handleErrors } from './util';

enum CacheKeys {
  Players = 'players',
  TournamentsGames = 'tournamentsGames',
  RandomGames = 'randomGames',
  TournamentPlayers = 'tournamentPlayers',
  Tables = 'Tables',
  TournamentTables = 'TournamentTables',
  Tournaments = 'Tournaments',
}

export const usePlayers = (tournament?: number) => {
  return useQuery<Api.Player[], Error>(
    [CacheKeys.Players, tournament],
    async (): Promise<Api.Player[]> => {
      return api.players
        .playersList({ exclude: tournament })

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
    CacheKeys.RandomGames,
    async (): Promise<Api.Game[]> => {
      return api.tournaments
        .gamesRandomDetail(tournament)
        .then(handleErrors)
        .then((r) => r.data);
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

export const useTables = () => {
  return useQuery<Api.Table[], Error>(
    CacheKeys.Tables,
    async (): Promise<Api.Table[]> => {
      return api.tables
        .tablesList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentTables = (tournament: string) => {
  return useQuery<Api.TournamentTable[], Error>(
    CacheKeys.TournamentTables,
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

export const useTournamentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (trournament: Api.CreateTournament) =>
      api.tournaments.tournamentsCreate(trournament),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CacheKeys.Tournaments]);
      }
    }
  );
};

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
      }
    }
  );
};

export const useTournamentPlayerDeleteMutation = (
  tournament: string,
  nickname: string
) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => api.tournaments.playersDelete(tournament, nickname),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          CacheKeys.TournamentPlayers,
          tournament,
        ]);
        queryClient.invalidateQueries(CacheKeys.RandomGames);
      }  
    }
  );
};

export const usePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (player: Api.CreatePlayer) => api.players.playersCreate(player),
    {
      onSuccess: () => queryClient.invalidateQueries(CacheKeys.Players),
    }
  );
};

type GameMutationParams = {
  tournament: string;
  table: string;
  game: Api.GameResult;
};

export const useGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (result: GameMutationParams) =>
      api.tournaments.tablesGamesCreate(
        result.tournament,
        result.table,
        result.game
      ),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(CacheKeys.TournamentPlayers)
    }
  );
};
