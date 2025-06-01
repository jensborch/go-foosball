/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddPlayer {
  nickname: string;
  ranking?: number;
}

export interface AddTable {
  id: number;
}

export interface Color {
  left: string;
  right: string;
}

export interface CreatePlayer {
  /** @minLength 2 */
  nickname: string;
  /** @minLength 2 */
  realname?: string;
  rfid?: string;
}

export interface CreateTable {
  color: Color;
  name: string;
}

export interface CreateTournament {
  initial: number;
  name: string;
  score: number;
  timeout?: number;
}

export interface Error {
  error: string;
}

export interface Game {
  created: string;
  leftPlayers: string[];
  leftScore: number;
  rightPlayers: string[];
  rightScore: number;
  table: Table;
  updated: string;
  winner?: string;
}

export interface GameResult {
  /**
   * @maxItems 2
   * @minItems 1
   */
  leftPlayers: string[];
  /**
   * @maxItems 2
   * @minItems 1
   */
  rightPlayers: string[];
  winner: "right" | "left" | "draw";
}

export interface GameStartEvent {
  id: string;
}

export interface Player {
  created: string;
  nickname: string;
  realname?: string;
  rfid?: string;
  updated: string;
}

export interface Table {
  color: Color;
  created: string;
  id: number;
  name: string;
  updated: string;
}

export interface Tournament {
  created: string;
  id: number;
  initial: number;
  name: string;
  score: number;
  timeout: number;
  updated: string;
}

export interface TournamentHistory {
  nickname: string;
  ranking: number;
  realname?: string;
  updated: string;
}

export interface TournamentPlayer {
  active: boolean;
  latest?: string;
  nickname: string;
  ranking?: number;
  realname?: string;
  rfid?: string;
}

export interface TournamentPlayerHistory {
  ranking: number;
  updated: string;
}

export interface TournamentTable {
  created: string;
  id: number;
  table: Table;
  updated: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Go-foosball API
 * @version 0.8
 * @baseUrl /api
 * @contact
 *
 * Foosball tournament REST service.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  games = {
    /**
     * No description
     *
     * @tags game
     * @name GamesList
     * @summary Get all gamne results
     * @request GET:/games
     */
    gamesList: (params: RequestParams = {}) =>
      this.request<Game[], any>({
        path: `/games`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags game
     * @name GamesDetail
     * @summary Get gamne results
     * @request GET:/games/{id}
     */
    gamesDetail: (id: string, params: RequestParams = {}) =>
      this.request<Game, Error>({
        path: `/games/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  players = {
    /**
     * No description
     *
     * @tags player
     * @name PlayersList
     * @summary List players
     * @request GET:/players
     */
    playersList: (
      query?: {
        /** exlude tournament from list */
        exclude?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Player[], any>({
        path: `/players`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags player
     * @name PlayersCreate
     * @summary Create a new player
     * @request POST:/players
     */
    playersCreate: (player: CreatePlayer, params: RequestParams = {}) =>
      this.request<Player, Error>({
        path: `/players`,
        method: "POST",
        body: player,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags player
     * @name PlayersDetail
     * @summary Get player
     * @request GET:/players/{id}
     */
    playersDetail: (id: string, params: RequestParams = {}) =>
      this.request<Player, Error>({
        path: `/players/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags player
     * @name PlayersDelete
     * @summary Delete player
     * @request DELETE:/players/{id}
     */
    playersDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/players/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),
  };
  tables = {
    /**
     * No description
     *
     * @tags table
     * @name TablesList
     * @summary Get all tables
     * @request GET:/tables
     */
    tablesList: (
      query?: {
        /** exlude tournament from list */
        exclude?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Table[], any>({
        path: `/tables`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags table
     * @name TablesCreate
     * @summary Create table
     * @request POST:/tables/
     */
    tablesCreate: (table: CreateTable, params: RequestParams = {}) =>
      this.request<Table, Error>({
        path: `/tables/`,
        method: "POST",
        body: table,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags table
     * @name TablesDetail
     * @summary Get table
     * @request GET:/tables/{id}
     */
    tablesDetail: (id: string, params: RequestParams = {}) =>
      this.request<Table, Error>({
        path: `/tables/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  tournaments = {
    /**
     * No description
     *
     * @tags tournament
     * @name TournamentsList
     * @summary Get all tournaments
     * @request GET:/tournaments
     */
    tournamentsList: (params: RequestParams = {}) =>
      this.request<Tournament[], any>({
        path: `/tournaments`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TournamentsCreate
     * @summary Create tournament
     * @request POST:/tournaments
     */
    tournamentsCreate: (tournament: CreateTournament, params: RequestParams = {}) =>
      this.request<Tournament, Error>({
        path: `/tournaments`,
        method: "POST",
        body: tournament,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TournamentsDetail
     * @summary Get tournament
     * @request GET:/tournaments/{id}
     */
    tournamentsDetail: (id: string, params: RequestParams = {}) =>
      this.request<Tournament, Error>({
        path: `/tournaments/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TournamentsDelete
     * @summary Remove tournament
     * @request DELETE:/tournaments/{id}
     */
    tournamentsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/tournaments/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name EventsGameDetail
     * @summary Opens a web socket for tournamnent game start events
     * @request GET:/tournaments/{id}/events/game
     */
    eventsGameDetail: (id: string, params: RequestParams = {}) =>
      this.request<GameStartEvent, any>({
        path: `/tournaments/${id}/events/game`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name EventsPlayerDetail
     * @summary Opens a web socket for tournamnent player events
     * @request GET:/tournaments/{id}/events/player
     */
    eventsPlayerDetail: (id: string, params: RequestParams = {}) =>
      this.request<TournamentPlayer, any>({
        path: `/tournaments/${id}/events/player`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name GamesDetail
     * @summary Get all games in a tournament
     * @request GET:/tournaments/{id}/games
     */
    gamesDetail: (id: string, params: RequestParams = {}) =>
      this.request<Game[], any>({
        path: `/tournaments/${id}/games`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags actions
     * @name GamesRandomDetail
     * @summary Get random game for a tournament
     * @request GET:/tournaments/{id}/games/random
     */
    gamesRandomDetail: (id: string, params: RequestParams = {}) =>
      this.request<Game[], Error>({
        path: `/tournaments/${id}/games/random`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags actions
     * @name GamesStartDetail
     * @summary Publishes a game start event
     * @request GET:/tournaments/{id}/games/start
     */
    gamesStartDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/tournaments/${id}/games/start`,
        method: "GET",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name HistoryDetail
     * @summary Get ranking history for a tournament
     * @request GET:/tournaments/{id}/history
     */
    historyDetail: (
      id: string,
      query: {
        /**
         * The RFC3339 date to get history from
         * @format date
         */
        from: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TournamentHistory[], Error>({
        path: `/tournaments/${id}/history`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name PlayersDetail
     * @summary Get players in tournament
     * @request GET:/tournaments/{id}/players
     */
    playersDetail: (id: string, params: RequestParams = {}) =>
      this.request<TournamentPlayer[], Error>({
        path: `/tournaments/${id}/players`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name PlayersCreate
     * @summary Add player to tournament
     * @request POST:/tournaments/{id}/players
     */
    playersCreate: (id: string, player: AddPlayer, params: RequestParams = {}) =>
      this.request<TournamentPlayer, Error>({
        path: `/tournaments/${id}/players`,
        method: "POST",
        body: player,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name PlayersDelete
     * @summary Remove all players from tournament
     * @request DELETE:/tournaments/{id}/players
     */
    playersDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/tournaments/${id}/players`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name PlayersHistoryDetail
     * @summary Get player ranking history in tournament
     * @request GET:/tournaments/{id}/players/{nickname}/history
     */
    playersHistoryDetail: (
      id: string,
      nickname: string,
      query: {
        /**
         * The RFC3339 date to get history from
         * @format date
         */
        from: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TournamentPlayerHistory[], Error>({
        path: `/tournaments/${id}/players/${nickname}/history`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name PlayersDelete2
     * @summary Remove player from tournament
     * @request DELETE:/tournaments/{id}/players/{player}
     * @originalName playersDelete
     * @duplicate
     */
    playersDelete2: (id: string, player: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/tournaments/${id}/players/${player}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TablesDetail
     * @summary Get tables in a tournament
     * @request GET:/tournaments/{id}/tables
     */
    tablesDetail: (id: string, params: RequestParams = {}) =>
      this.request<TournamentTable[], Error>({
        path: `/tournaments/${id}/tables`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TablesCreate
     * @summary Add table to tournament
     * @request POST:/tournaments/{id}/tables
     */
    tablesCreate: (id: string, table: AddTable, params: RequestParams = {}) =>
      this.request<TournamentTable, Error>({
        path: `/tournaments/${id}/tables`,
        method: "POST",
        body: table,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TablesDelete
     * @summary Remove table from tournament
     * @request DELETE:/tournaments/{id}/tables/{tableId}
     */
    tablesDelete: (id: string, tableId: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/tournaments/${id}/tables/${tableId}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tournament
     * @name TablesGamesCreate
     * @summary Submit gamne results
     * @request POST:/tournaments/{id}/tables/{table}/games
     */
    tablesGamesCreate: (id: string, table: string, game: GameResult, params: RequestParams = {}) =>
      this.request<Game, Error>({
        path: `/tournaments/${id}/tables/${table}/games`,
        method: "POST",
        body: game,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
