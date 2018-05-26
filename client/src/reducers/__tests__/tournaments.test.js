import { isPlayerInactive, isPlayerActive } from '..';
import { actions } from '../tournaments';
import players from '../players';
import active from '../active';

test('Players should contain all player', () => {
  const action = actions.receiveTournamentPlayers(42, [
    { nickname: 'key', realname: 'value' },
  ]);
  const state = players({}, action);
  expect(state['key'].realname).toBe('value');
});

test('Active should contain active player', () => {
  const action = actions.receiveTournamentPlayers(42, [
    { nickname: 'active', active: true },
    { nickname: 'inactive', active: false },
  ]);
  const state = active({}, action);
  console.log(state[42]);
  expect(state[42]).toContain('active');
  expect(state[42]).not.toContain('inactive');
});

test('Activate should add player to active', () => {
  const action = actions.activateTournamentPlayer(42, 'name');
  const state = active(
    {
      42: [],
      82: ['name'],
    },
    action
  );
  expect(state[42]).toContain('name');
  expect(state[82]).toContain('name');
});

test('Deactivate should remove player from active', () => {
  const action = actions.deactivateTournamentPlayer(42, 'name');
  const state = active(
    {
      42: ['name'],
      82: ['name'],
    },
    action
  );
  expect(state[42]).not.toContain('name');
  expect(state[82]).toContain('name');
});

test('IsPlayerActive selector should return activ players', () => {
  const state = {
    active: {
      1: ['a', 'b'],
      2: ['c'],
    },
  };
  expect(isPlayerActive(state, 1, 'a')).toBe(true);
  expect(isPlayerActive(state, 1, 'c')).toBe(false);
  expect(isPlayerActive(state, 5, 'a')).toBe(false);
});

test('IsPlayerInactive selector should return inactiv players', () => {
  const state = {
    inactive: {
      1: ['a', 'b'],
      2: ['c'],
    },
  };
  expect(isPlayerInactive(state, 1, 'a')).toBe(true);
  expect(isPlayerInactive(state, 1, 'c')).toBe(false);
  expect(isPlayerInactive(state, 5, 'a')).toBe(false);
});
