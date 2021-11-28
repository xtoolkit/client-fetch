import {Api} from '../src';
export {gql} from '../src';
import type {Request, ApiOptions} from '../src';
export type {Request};

function requestBuilder(error?: Error) {
  const request: Request = input => {
    input.onRequest(input);
    const gate = new Promise((res, rej) =>
      setTimeout(() => {
        error
          ? rej(error)
          : res({
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
  return request;
}

const app = {
  name: 'client-fetch'
};

export function apiBuilder(options: ApiOptions, error?: any) {
  const api = new Api<typeof app>(options, requestBuilder(error));
  api.setApp(app);
  return api;
}
