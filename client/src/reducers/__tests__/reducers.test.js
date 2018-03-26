import { active, players } from '../reducers';
import {
  receiveTournamentPlayers,
  activateTournamentPlayer,
  deactivateTournamentPlayer,
} from '../../actions/actions';

test('Players should contain all player', () => {
  const action = receiveTournamentPlayers(42, [
    { nickname: 'key', realname: 'value' },
  ]);
  const state = players({}, action);
  expect(state['key'].realname).toBe('value');
});

test('Active should contain active player', () => {
  const action = receiveTournamentPlayers(42, [
    { nickname: 'active', active: true },
    { nickname: 'inactive', active: false },
  ]);
  const state = active({}, action);
  console.log(state[42]);
  expect(state[42]).toContain('active');
  expect(state[42]).not.toContain('inactive');
});

test('Activate should add player to active', () => {
  const action = activateTournamentPlayer(42, 'name');
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
  const action = deactivateTournamentPlayer(42, 'name');
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
