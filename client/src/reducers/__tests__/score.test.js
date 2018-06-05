import reducer, { getPlayerScore } from '../score';
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
      players: [{ nickname: 'a', score: 10 }, { nickname: 'b', score: 20 }],
      id: 'id',
    }
  );
  expect(state).toEqual({ id: { a: 10, b: 20 } });
});

test('Selector should returne score', () => {
  const score = getPlayerScore(
    {
      score: {
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
