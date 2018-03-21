import React from 'react';
import Menu from '../Menu';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

test('Should render with title', () => {
  const component = renderer.create(
    <MemoryRouter>
      <Menu title="test" />
    </MemoryRouter>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
