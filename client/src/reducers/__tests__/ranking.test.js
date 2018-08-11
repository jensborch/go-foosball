import reducer, { getPlayerRanking } from '../ranking';
import { types } from '../tournaments';

test('Reducer should handle unknown types', () => {
  const state = reducer({}, 'unknown');
  expect(state).toEqual({});
});

test('Reducer should handle player events with no players', () => {
  const state = reducer(
    {},
    {
      type: types.RECEIVE_TOURNAMET_PLAYERS,
      players: [],
      id: 'id',
    }
  );
  expect(state).toEqual({ id: {} });
});

test('Reducer should handle player events with players', () => {
  const state = reducer(
    {},
    {
      type: types.RECEIVE_TOURNAMET_PLAYERS,
      players: [{ nickname: 'a', ranking: 10 }, { nickname: 'b', ranking: 20 }],
      id: 'id',
    }
  );
  expect(state).toEqual({ id: { a: 10, b: 20 } });
});

test('Reducer should handle activet player events', () => {
  const state = reducer(
    {},
    {
      type: types.ACTIVATE_TOURNAMET_PLAYER,
      tournamentId: 't',
      nickname: 'n',
      ranking: 1
    }
  );
  expect(state).toEqual({ t: { n: 1 } });
});

test('Selector should returne ranking', () => {
  const score = getPlayerRanking(
    {
      ranking: {
        t: {
          p: 42,
        },
      },
    },
    't',
    'p'
  );
  expect(score).toBe(42);
});
