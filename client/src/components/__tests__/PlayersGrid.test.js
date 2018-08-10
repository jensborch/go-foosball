import React from 'react';
import PlayersGrid from '../PlayersGrid';
import renderer from 'react-test-renderer';

test('Should render players', () => {
  const props = {
    tournament: 'uuid',
    players: [
      {
        nickname: 'nick',
        realname: 'name',
      },
    ],
    ranking: 42,
    classes: {},
    deselect: () => {},
    select: () => {},
    score: 1500,
  };
  const component = renderer.create(<PlayersGrid {...props} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
