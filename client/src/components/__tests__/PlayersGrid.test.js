import React from 'react';
import PlayersGrid from '../PlayersGrid';
import renderer from 'react-test-renderer';

test('Should render players', () => {
  const classes = {
    list: '',
  };
  const data = [
    {
      nickname: 'nick',
      realname: 'name',
    },
  ];
  const deselect = () => {};
  const select = () => {};
  const component = renderer.create(
    <PlayersGrid
      id="1"
      data={data}
      classes={classes}
      select={select}
      deselect={deselect}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
