// Link.react.test.js
import React from 'react';
import Menu from '../menu';
import renderer from 'react-test-renderer';

test('Should render with title', () => {
  const component = renderer.create(<Menu title="test" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
