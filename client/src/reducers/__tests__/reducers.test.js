import { active } from '../reducers';
import { receiveTournamentPlayers } from '../../actions/actions';

test('Tournament should contain active player', () => {
  const action = receiveTournamentPlayers(42, [{ nickname: 'name' }]);
  const state = active({}, action);
  expect(state[42]).toContain('name');
});
