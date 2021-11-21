import axiosRequest from '../src';

describe('http request test', () => {
  it('basic', async () => {
    let valid = false;
    const {gate} = axiosRequest({
      url: 'https://httpbin.org/get',
      method: 'get',
      params: {
        test: 9
      },
      onError() {},
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse({data}) {
        valid = data.args.test === '9';
      }
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('with authorize', async () => {
    let valid = false;
    const {gate} = axiosRequest({
      url: 'https://httpbin.org/basic-auth/foo/bar',
      method: 'get',
      options: {
        auth: {
          username: 'foo',
          password: 'bar'
        }
      },
      onError() {},
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse({data}) {
        valid = data.user === 'foo';
      }
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('request timeout', async () => {
    let valid = false;
    const {gate} = axiosRequest({
      url: 'https://httpbin.org/get',
      method: 'get',
      options: {
        timeout: 1
      },
      onError() {},
      onCancel() {},
      onTimeout() {
        valid = true;
      },
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse() {}
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('request cancel', async () => {
    let valid = false;
    const {cancel} = axiosRequest({
      url: 'https://httpbin.org/get',
      method: 'get',
      onError() {},
      onCancel() {
        valid = true;
      },
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse() {}
    });
    cancel();
    expect(valid).toBe(true);
  });
});
