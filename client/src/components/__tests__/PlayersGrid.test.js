import React from 'react';
import PlayersGrid from '../PlayersGrid';
import renderer from 'react-test-renderer';

describe('PlayersGrid', () => {
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
    create: () => {},
    score: 1500,
  };
  test('Should render players', () => {
    const component = renderer.create(<PlayersGrid {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
