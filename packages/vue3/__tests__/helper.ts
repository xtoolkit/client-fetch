import type {ApiOptions, Request} from '@client-fetch/core';
import {mount} from '@vue/test-utils';
import {install} from '../src';
export {useApi, usePromiseApi, useRunApi} from '../src';

const request: Request = input => {
  input.onRequest(input);
  const gate = new Promise(res =>
    setTimeout(() => {
      res({
        status: 200,
        data: 'work'
      });
    }, 50)
  )
    .then(x => input.onResponse(x))
    .catch(x => input.onError(x));
  return {
    gate,
    cancel: x => x
  };
};

export const plugin = (component: any, options?: ApiOptions) =>
  mount(component, {
    global: {
      plugins: [[install, request, options]]
    }
  });
