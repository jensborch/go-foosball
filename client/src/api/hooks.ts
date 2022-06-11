import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as Api from '../api/Api';
import { api, handleErrors } from '../api/Util';

export const usePlayers = () => {
  return useQuery<Api.Player[], Error>(
    'players',
    async (): Promise<Api.Player[]> => {
      return api.players
        .playersList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentPlayers = (tournament: string) => {
  return useQuery<Api.TournamentPlayer[], Error>(
    ['tournamentPlayers', tournament],
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
    'tables',
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
    'tournamentTables',
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
    'tournaments',
    async (): Promise<Api.Tournament[]> => {
      return api.tournaments
        .tournamentsList()
        .then(handleErrors)
        .then((r) => r.data);
    }
  );
};

export const useTournamentPlayerMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (player: Api.AddPlayer) => api.tournaments.playersCreate(id, player),
    {
      onSuccess: () => queryClient.invalidateQueries('tournamentPlayers'),
      onError: (error) => {
        handleErrors(error as Response);
      },
    }
  );
};

export const usePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (player: Api.CreatePlayer) => api.players.playersCreate(player),
    {
      onSuccess: () => queryClient.invalidateQueries('players'),
      onError: (error) => {
        handleErrors(error as Response);
      },
    }
  );
};
