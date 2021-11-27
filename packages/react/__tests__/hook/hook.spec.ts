import {createElement} from 'react';
import {act, create} from 'react-test-renderer';
import Basic from './components/Basic';
import FunctionMethod from './components/FunctionMethod';
import {install, request} from '../helper';
import type {ReactTestRenderer} from 'react-test-renderer';

describe('React test', () => {
  it('install after install', () => {
    try {
      install({request});
    } catch (error: any) {
      expect(error.message).toBe('Api before installed');
    }
  });

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

  it('function', async () => {
    let rendered: ReactTestRenderer;
    await act(async () => {
      rendered = create(createElement(FunctionMethod));
      await new Promise(res => setTimeout(res, 100));
    });
    expect(rendered!.toJSON()).toMatchObject({
      children: ['/user/foo/bar']
    });
  });
});
