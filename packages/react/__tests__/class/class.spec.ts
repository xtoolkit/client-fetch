import {createElement} from 'react';
import {act, create} from 'react-test-renderer';
import Basic from './components/Basic';
import type {ReactTestRenderer} from 'react-test-renderer';

describe('React test', () => {
  it('hook', async () => {
    let rendered: ReactTestRenderer;
    await act(async () => {
      rendered = create(createElement(Basic));
      await new Promise(res => setTimeout(res, 100));
    });
    expect(rendered!.toJSON()).toMatchObject({
      children: ['work']
    });
  });
});
