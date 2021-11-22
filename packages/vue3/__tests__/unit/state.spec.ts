import {VueState} from '../../src/State';

describe('state test', () => {
  it('create state', () => {
    const data = {
      url: '/test',
      input: {
        user: 'foo'
      }
    };
    const x = new VueState(data);
    const state = x.getValue();
    expect(state.url).toBe(data.url);
    expect(state.input.user).toBe(data.input.user);
  });

  it('update state', async () => {
    const data = {
      url: '/test',
      input: {
        user: 'foo'
      }
    };
    const x = new VueState(data);
    const state = x.getValue();
    state.url = '/user';
    state.input.user = 'bar';
    expect(x.getValue().url).toBe('/user');
    expect(x.getValue().input.user).toBe('bar');
  });
});
