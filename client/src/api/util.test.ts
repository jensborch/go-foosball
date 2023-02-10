import { add, sub } from "date-fns";
import { TournamentHistory } from "./Api";
import { findMax, findMin } from "./util";

test("min to be undefined", () => {
  const min = findMin([], new Date(), "test", 100);
  expect(min).toBeUndefined();
});

test("min to be something", () => {
  const now = new Date();
  const history: TournamentHistory[] = [
    {
      nickname: "test",
      ranking: 44,
      updated: add(now, { minutes: 1 }).toUTCString(),
    },
    {
      nickname: "test",
      ranking: 22,
      updated: sub(now, { minutes: 1 }).toUTCString(),
    },
    {
      nickname: "test",
      ranking: 11,
      updated: sub(now, { minutes: 2 }).toUTCString(),
    },
    {
      nickname: "different",
      ranking: 33,
      updated: sub(now, { minutes: 1 }).toUTCString(),
    },
  ];
  const min = findMin(history, now, "test", 100);
  expect(min).not.toBeUndefined();
  expect(min?.ranking).toEqual(22);
});

test("max to be undefined", () => {
  const max = findMax([], new Date(), "test");
  expect(max).toBeUndefined();
});

test("max to be something", () => {
  const now = new Date();
  const history: TournamentHistory[] = [
    {
      nickname: "test",
      ranking: 44,
      updated: add(now, { minutes: 1 }).toUTCString(),
    },
    {
      nickname: "test",
      ranking: 22,
      updated: sub(now, { minutes: 1 }).toUTCString(),
    },
    {
      nickname: "test",
      ranking: 11,
      updated: sub(now, { minutes: 2 }).toUTCString(),
    },
    {
      nickname: "different",
      ranking: 33,
      updated: sub(now, { minutes: 1 }).toUTCString(),
    },
  ];
  const min = findMax(history, now, "test");
  expect(min).not.toBeUndefined();
  expect(min?.ranking).toEqual(44);
});
