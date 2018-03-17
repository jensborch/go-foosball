import { active, players } from '../reducers';
import { receiveTournamentPlayers } from '../../actions/actions';

test('Players should contain all player', () => {
  const action = receiveTournamentPlayers(42, [
    { nickname: 'key', realname: 'value' },
  ]);
  const state = players({}, action);
  expect(state['key'].realname).toBe('value');
});

test('Active should contain active player', () => {
  const action = receiveTournamentPlayers(42, [{ nickname: 'name' }]);
  const state = active({}, action);
  expect(state[42]).toContain('name');
});
