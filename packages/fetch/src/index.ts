import type {Request} from '@client-fetch/core';

export const request: Request = input => {
  const controller = new AbortController();

  let params = '';
  if (input.params && Object.keys(input.params)) {
    params = '?' + new URLSearchParams(input.params as Record<string, string>);
  }

  let timeout: any;
  if (input.options?.timeout) {
    timeout = setTimeout(() => {
      input.onTimeout('timeout your request');
    }, input.options?.timeout);
  }

  if (input.options?.auth) {
    if (!input.headers) {
      input.headers = {};
    }
    input.headers.Authorization =
      'Basic ' +
      Buffer.from(
        input.options.auth.username + ':' + input.options.auth.password,
        'base64'
      );
  }

  input.onRequest(input);
  const gate = fetch(input.url + params, {
    method: input.method,
    body: input.data,
    headers: input.headers,
    signal: controller.signal,
    credentials: input.options?.credentials ? 'include' : undefined
  })
    .then(res => {
      input.onResponse(res);
      if (input.options?.timeout) {
        clearTimeout(timeout);
      }
    })
    .catch(e => {
      input.onError(e);
    });
  return {
    cancel: () => controller.abort(),
    gate
  };
};
