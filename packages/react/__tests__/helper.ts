import type {Request} from '@client-fetch/core';
import {install, useApi, useRunApi, withApi} from '../src/index';

export {install, useRunApi, withApi};

try {
  useApi();
} catch (error) {}

export const request: Request = input => {
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

install({request, app: {name: 'bar'}});
