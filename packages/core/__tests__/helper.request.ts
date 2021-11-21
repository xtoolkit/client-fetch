import type {Request} from './helper';

export function requestTest(request: Request) {
  it('basic', async () => {
    let valid = false;
    const {gate} = request({
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
      onResponse(res) {
        valid = res.data.args.test === '9';
      }
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('with authorize', async () => {
    let valid = false;
    const {gate} = request({
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

  it('request timeout true', async () => {
    let valid = true;
    const {gate} = request({
      url: 'https://httpbin.org/get',
      method: 'get',
      options: {
        timeout: 5000
      },
      onError() {},
      onCancel() {},
      onTimeout() {
        valid = false;
      },
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse() {}
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('request timeout cancel', async () => {
    let valid = false;
    request({
      url: 'https://httpbin.org/delay/1000',
      method: 'get',
      options: {
        timeout: 100
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
    await new Promise(res => setTimeout(res, 200));
    expect(valid).toBe(true);
  });

  it('request cancel', () => {
    let valid = false;
    const {cancel} = request({
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

  it('text body', async () => {
    let valid = false;
    const {gate} = request({
      url: 'https://httpbin.org/base64/Y2xpZW50LWZldGNoL2NvcmU%3D',
      method: 'get',
      onError() {},
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse({data}) {
        valid = data === 'client-fetch/core';
      }
    });
    await gate;
    expect(valid).toBe(true);
  });

  it('faild request', async () => {
    console.error = jest.fn();
    let valid = false;
    const {gate} = request({
      url: 'http://thisisnotaserver.cs/foo',
      method: 'get',
      onError() {
        valid = true;
      },
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse() {}
    });
    try {
      await gate;
    } catch {}
    expect(valid).toBe(true);
  });

  it('faild request response', async () => {
    console.error = jest.fn();
    let valid = false;
    const {gate} = request({
      url: 'https://httpbin.org/status/500',
      method: 'get',
      onError({status}) {
        valid = 500 === status;
      },
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse() {}
    });
    try {
      await gate;
    } catch {}
    expect(valid).toBe(true);
  });

  it('credentials test', async () => {
    let valid = false;
    const {gate} = request({
      url: 'https://httpbin.org/cookies/set/client-fetch/core',
      method: 'get',
      options: {
        credentials: 'include'
      },
      headers: {
        Cookie: 'client-fetch=core'
      },
      onError() {},
      onCancel() {},
      onTimeout() {},
      onRequest() {},
      onUploadProgress() {},
      onDownloadProgress() {},
      onResponse({data}) {
        valid = data.cookies['client-fetch'] === 'core';
      }
    });
    await gate;
    expect(valid).toBe(true);
  });
}
