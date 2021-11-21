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
    withCredentials: input.options?.credentials ? true : false,
    auth: input.options?.auth
  })
    .then(res => input.onResponse({data: res.data, status: res.status}))
    .catch(e => {
      const o: Record<string, string> = {};
      if (e.response) {
        o.status = e.response.status;
        o.data = e.response.message;
      } else {
        o.data = e.message;
      }
      input.onError(o);
      if (/^timeout/.test(e.message)) {
        input.onTimeout(o);
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
