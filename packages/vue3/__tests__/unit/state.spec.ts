import {stateManager} from '../../src/state';

describe('state test', () => {
  it('create state', () => {
    const data = {
      url: '/test',
      input: {
        user: 'foo'
      }
    };
    const x = stateManager.createState(data);
    const state = stateManager.getState<typeof data>(x);
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
    const x = stateManager.createState(data);
    const state = stateManager.getState<typeof data>(x);
    state.url = '/user';
    state.input.user = 'bar';
    expect(x.value.url).toBe('/user');
    expect(x.value.input.user).toBe('bar');
  });
});
