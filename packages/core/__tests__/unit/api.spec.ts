import {RequestInput} from '../../src';
import {apiBuilder} from '../helper';

interface UserInput {
  id: number;
  token?: string;
}

const user = (input: UserInput): RequestInput => ({
  url: '/api/user',
  method: 'get',
  params: {userId: input.id}
});

const appCheck = function (this: any): RequestInput {
  return {url: this.name, method: 'delete'};
};

describe('Api test', () => {
  const api = apiBuilder({});

  it('manual test', () => {
    api.run('manual', {
      url: '/test',
      method: 'post',
      onRequest() {
        expect(this.url).toBe('/test');
        expect(this.method).toBe('post');
      }
    });
  });

  it('exist method', () => {
    api.run(user, {
      input: {
        id: 20
      },
      onRequest() {
        expect(this.url).toBe('/api/user');
        expect(this.params).toMatchObject({
          userId: 20
        });
      }
    });
  });

  it('run mode', async () => {
    const x = api.run('manual', {
      url: '/test',
      method: 'get',
      onResponse(data) {
        expect(data.status).toBe(this.status);
        expect(data.data).toBe(this.data);
      },
      options: {
        default: 'run mode'
      }
    });
    expect(x.loading).toBe(true);
    expect(x.error).toBe(false);
    expect(x.data).toBe('run mode');
    expect(x.status).toBe(-1);
    await new Promise(res => setTimeout(res, 100));
    expect(x.loading).toBe(false);
    expect(x.error).toBe(false);
    expect(x.data).toBe('work');
    expect(x.status).toBe(200);
  });

  it('promise mode', async () => {
    const {data, status} = await api.promise('manual', {
      url: '/',
      method: 'get'
    });
    expect(data).toBe('work');
    expect(status).toBe(200);
  });

  it('app access', async () => {
    api.run(appCheck, {
      onRequest() {
        expect(this.url).toBe('client-fetch');
      }
    });
  });

  it('error hook', async () => {
    const api2 = apiBuilder({}, new Error('errorWork'));
    const x = api2.run('manual', {
      url: '/test',
      method: 'get'
    });
    expect(x.loading).toBe(true);
    expect(x.error).toBe(false);
    expect(x.errorMessage).toBe(null);
    expect(x.data).toBe(null);
    expect(x.status).toBe(-1);
    await new Promise(res => setTimeout(res, 100));
    expect(x.loading).toBe(false);
    expect(x.error).toBe(true);
    expect(x.errorMessage).toBe('errorWork');
    expect(x.data).toBe(null);
    expect(x.status).toBe(-1);

    const api3 = apiBuilder(
      {},
      {response: {message: 'errorWork', status: 403}}
    );
    const {errorMessage, status} = await api3.promise('manual', {
      url: '/asd',
      method: 'get'
    });
    expect(errorMessage).toBe('errorWork');
    expect(status).toBe(403);
  });
});
