import { Api } from "./Api";

export function toLocaleDateString(
  date: string | undefined
): string | undefined {
  return date === undefined ? undefined : new Date(date).toLocaleDateString();
}

export function handleErrors<R extends Response>(response: R) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const conf: any = {
  host: "localhost:8080",
  baseUrl: () => `http://${conf.host}`,
};

export const api = new Api({ baseUrl: conf.baseUrl() });
