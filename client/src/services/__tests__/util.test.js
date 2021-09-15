import { transformDateFormat } from '../util';

test('Date string should be change to data object', () => {
  const json = {
    created: '2018-03-16T21:10:44.270703034+01:00',
    updated: '2018-03-16T21:10:44.270703034+01:00',
    test: 'nothing',
  };

  const transformed = transformDateFormat(json);
  expect(typeof transformed.created).toBe('object');
  expect(typeof transformed.updated).toBe('object');
  expect(typeof transformed.test).toBe('string');
});
