import { isAfter, isBefore } from "date-fns";
import { Api, TournamentHistory } from "./Api";

export function handleErrors<R extends Response>(response: R) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export type Conf = {
  host: string;
  baseUrl: () => string;
};

export const conf: Conf = {
  host: "localhost:8080",
  baseUrl: () => `http://${conf.host}`,
};

export const api = new Api({ baseUrl: `${conf.baseUrl()}/api` });

const findByNickname = (history: TournamentHistory[], nickname: string) => {
  return history
    .filter((h) => h.nickname === nickname)
    .map((h) => ({
      ...h,
      updated: new Date(h.updated),
    }));
};

export const findMin = (
  history: TournamentHistory[],
  min: Date,
  nickname: string,
  initRanking: number
) => {
  const all = findByNickname(history, nickname).filter((h) =>
    isBefore(h.updated, min)
  );
  if (all.length > 0) {
    return all.reduce((a, b) => (isAfter(a.updated, b.updated) ? a : b));
  } else {
    return {
      nickname,
      ranking: initRanking,
      updated: min,
    };
  }
};

export const findMax = (
  history: TournamentHistory[],
  max: Date,
  nickname: string
) => {
  const all = findByNickname(history, nickname).filter((h) =>
    isAfter(h.updated, max)
  );
  if (all.length > 0) {
    return all.reduce((a, b) => (isAfter(a.updated, b.updated) ? a : b));
  } else {
    return undefined;
  }
};
