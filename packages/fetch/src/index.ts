import fetch from 'cross-fetch';
import type {Request} from '@client-fetch/core';

const request: Request = input => {
  const controller = new AbortController();

  let params = '';
  if (input.params && Object.keys(input.params)) {
    params = '?' + new URLSearchParams(input.params as Record<string, string>);
  }

  let timeout: any;
  if (input.options?.timeout) {
    timeout = setTimeout(() => {
      controller.abort();
      input.onTimeout('timeout your request');
    }, input.options?.timeout);
  }

  if (input.options?.auth) {
    if (!input.headers) {
      input.headers = {};
    }
    input.headers.Authorization =
      'Basic ' +
      btoa(input.options.auth.username + ':' + input.options.auth.password);
  }

  input.onRequest(input);
  const gate = fetch(input.url + params, {
    method: input.method,
    body: input.data,
    headers: input.headers,
    signal: controller.signal,
    credentials: input.options?.credentials
  })
    .then(
      response =>
        new Promise((res, rej) => {
          if (input.options?.timeout) {
            clearTimeout(timeout);
          }
          if (!response.ok) {
            return rej({data: response.statusText, status: response.status});
          }
          response
            .text()
            .then(data => {
              try {
                res({data: JSON.parse(data), status: response.status});
              } catch (error) {
                res({data, status: response.status});
              }
            })
            .catch(
              /* istanbul ignore next */
              () => {
                res({data: response.body, status: response.status});
              }
            );
        })
    )
    .then(res => input.onResponse(res))
    .catch(e => {
      input.onError(e);
    });
  return {
    cancel: () => {
      controller.abort();
      input.onCancel();
    },
    gate
  };
};

export default request;
