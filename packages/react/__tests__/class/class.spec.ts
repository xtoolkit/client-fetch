import {createElement} from 'react';
import {act, create} from 'react-test-renderer';
import Empty from './components/Empty';
import Basic from './components/Basic';
import type {ReactTestRenderer} from 'react-test-renderer';

describe('React test', () => {
  it('empty work', () => {
    let rendered: ReactTestRenderer;
    act(() => {
      rendered = create(createElement(Empty));
    });
    expect(rendered!.toJSON()).toMatchObject({
      children: ['work']
    });
  });

  it('hook', async () => {
    let rendered: ReactTestRenderer;
    await act(async () => {
      rendered = create(createElement(Basic));
      await new Promise(res => setTimeout(res, 100));
    });
    expect(rendered!.toJSON()).toMatchObject({
      children: ['work-work-foo']
    });
  });
});
