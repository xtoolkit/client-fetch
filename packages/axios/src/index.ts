import axios from 'axios';
import type {Request} from '@client-fetch/core';

const request: Request = input => {
  const cancelToken = axios.CancelToken.source();
  input.onRequest(input);
  const gate = axios({
    url: input.url,
    params: input.params,
    data: input.data,
    headers: input.headers,
    cancelToken: cancelToken.token,
    onDownloadProgress: input.onDownloadProgress,
    onUploadProgress: input.onUploadProgress,
    timeout: input.options?.timeout,
    withCredentials: input.options?.credentials,
    auth: input.options?.auth,
    validateStatus: () => true
  })
    .then(res => {
      input.onResponse(res);
    })
    .catch(e => {
      input.onError(e);
      if (/^timeout/.test(e.message)) {
        input.onTimeout(e);
      }
    });
  return {
    cancel(msg) {
      input.onCancel(msg);
      cancelToken.cancel(msg);
    },
    gate
  };
};

export default request;
