import { useHistoryDiff } from "./History";
import { Tournament, TournamentHistory } from "../api/Api";
import { act, renderHook } from "@testing-library/react";
import { useTournament } from "../api/hooks";
import { UseQueryResult } from "@tanstack/react-query";
import { subHours } from "date-fns";

vi.mock("../api/hooks");

const useMockTournament = vi.mocked(useTournament);

describe("useHistoryDiff Hook", () => {
  const now = new Date();
  const historyData: TournamentHistory[] = [
    // Player 1 - positive gain
    {
      nickname: "Player1",
      ranking: 1500,
      updated: subHours(now, 4).toISOString(),
    },
    {
      nickname: "Player1",
      ranking: 1480,
      updated: subHours(now, 3).toISOString(),
    },
    {
      nickname: "Player1",
      ranking: 1450,
      updated: subHours(now, 2).toISOString(),
    },
    {
      nickname: "Player1",
      ranking: 1550,
      updated: subHours(now, 1).toISOString(),
    }, // max

    // Player 2 - no change
    {
      nickname: "Player2",
      ranking: 1400,
      updated: subHours(now, 3).toISOString(),
    },
    {
      nickname: "Player2",
      ranking: 1400,
      updated: subHours(now, 2).toISOString(),
    },
    {
      nickname: "Player2",
      ranking: 1400,
      updated: subHours(now, 1).toISOString(),
    },

    // Player 3 - negative gain
    {
      nickname: "Player3",
      ranking: 1300,
      updated: subHours(now, 3).toISOString(),
    },
    {
      nickname: "Player3",
      ranking: 1320,
      updated: subHours(now, 2).toISOString(),
    },
    {
      nickname: "Player3",
      ranking: 1340,
      updated: subHours(now, 1).toISOString(),
    }, // min

    // Player 4 - only one entry
    {
      nickname: "Player4",
      ranking: 1200,
      updated: subHours(now, 1).toISOString(),
    },

    // Player 5 - should be excluded (outside time range)
    {
      nickname: "Player5",
      ranking: 1000,
      updated: subHours(now, 1).toISOString(),
    },
  ];
  const tournamentData: Tournament = {
    created: "2022-12-30T00:00:00Z",
    id: 42,
    initial: 1500,
    name: "Test",
    score: 50,
    timeout: 60,
    updated: "2023-12-30T00:00:00Z",
  };

  it("calculates correct difference for each player", () => {
    const tournamentResult: UseQueryResult<Tournament, Error> = {
      data: tournamentData,
    } as UseQueryResult<Tournament, Error>;
    useMockTournament.mockReturnValue(tournamentResult);
    const { result } = renderHook(() =>
      useHistoryDiff("42", "month", historyData)
    );

    act(() =>
      expect(result.current).toEqual([
        ["Player1", 50],
        ["Player2", -100],
        ["Player3", -160],
        ["Player4", -300],
        ["Player5", -500],
      ])
    );
  });

  it("returns empty array when no history data is provided", () => {
    const tournamentResult: UseQueryResult<Tournament, Error> = {
      data: tournamentData,
    } as UseQueryResult<Tournament, Error>;
    useMockTournament.mockReturnValue(tournamentResult);
    const { result } = renderHook(() => useHistoryDiff("123", "month", []));
    expect(result.current).toEqual([]);
  });

  it("filters players with no ranking changes", () => {
    const tournamentResult: UseQueryResult<Tournament, Error> = {
      data: tournamentData,
    } as UseQueryResult<Tournament, Error>;
    useMockTournament.mockReturnValue(tournamentResult);
    const noChangeHistory = [
      {
        nickname: "Player1",
        ranking: 1400,
        updated: subHours(now, 2).toISOString(),
      },
      {
        nickname: "Player1",
        ranking: 1400,
        updated: subHours(now, 1).toISOString(),
      },
    ];

    const { result } = renderHook(() =>
      useHistoryDiff("123", "month", noChangeHistory)
    );
    expect(result.current).toEqual([["Player1", -100]]);
  });

  it("filters players with negative gains", () => {
    const tournamentResult: UseQueryResult<Tournament, Error> = {
      data: tournamentData,
    } as UseQueryResult<Tournament, Error>;
    useMockTournament.mockReturnValue(tournamentResult);
    const negativeHistory = [
      {
        nickname: "Player1",
        ranking: 1300,
        updated: subHours(now, 1).toISOString(),
      },
      {
        nickname: "Player1",
        ranking: 1400,
        updated: subHours(now, 1).toISOString(),
      },
      {
        nickname: "Player1",
        ranking: 1350,
        updated: subHours(now, 1).toISOString(),
      }, // max
    ];

    const { result } = renderHook(() =>
      useHistoryDiff("123", "month", negativeHistory)
    );
    expect(result.current).toEqual([["Player1", -150]]);
  });

  it("calculates difference from tournament initial rating when no max is found", () => {
    const tournamentResult: UseQueryResult<Tournament, Error> = {
      data: tournamentData,
    } as UseQueryResult<Tournament, Error>;
    useMockTournament.mockReturnValue(tournamentResult);
    const oldHistory = [
      {
        nickname: "Player1",
        ranking: 1200,
        updated: subHours(now, 1).toISOString(),
      },
    ];

    const period: "day" | "week" | "month" = "day";
    const { result } = renderHook(() =>
      useHistoryDiff("123", period, oldHistory)
    );

    expect(result.current).toEqual([["Player1", -300]]);
  });
});
