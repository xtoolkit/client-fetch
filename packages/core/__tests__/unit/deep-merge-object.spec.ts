import {deepMergeObject} from '../../src/utils';

describe('deep merge object test', () => {
  it('add new key', () => {
    expect(deepMergeObject({first: 1}, {second: 2})).toMatchObject({
      first: 1,
      second: 2
    });
  });

  it('overwrite key', () => {
    expect(
      deepMergeObject(
        {
          first: 2,
          options: {
            timeout: 1000,
            auth: false
          },
          input: [1, 2, 3]
        },
        {
          first: 1,
          options: {
            proxy: false,
            auth: {
              user: 'foo',
              password: 'bar'
            }
          }
        }
      )
    ).toMatchObject({
      first: 1,
      options: {
        timeout: 1000,
        proxy: false,
        auth: {
          user: 'foo',
          password: 'bar'
        }
      },
      input: [1, 2, 3]
    });
  });

  it('high priority else object types', () => {
    expect(deepMergeObject({first: {second: 2}}, {first: 1})).toMatchObject({
      first: 1
    });
  });

  it('check null in high priority', () => {
    expect(deepMergeObject({first: {second: 2}}, {first: null})).toMatchObject({
      first: null
    });
  });
});
