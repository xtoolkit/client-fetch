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

  it('manual test', async () => {
    const {data, status} = await api.execute('manual', {
      url: '/',
      method: 'get'
    });
    expect(data).toBe('work');
    expect(status).toBe(200);
  });

  it('exist method', async () => {
    await api.execute(user, {
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

  it('app access', async () => {
    await api.execute(appCheck, {
      onRequest() {
        expect(this.url).toBe('client-fetch');
      }
    });
  });

  it('error hook', async () => {
    const api3 = apiBuilder({}, {data: 'errorWork', status: 403});
    const {errorMessage, status} = await api3.execute('manual', {
      url: '/asd',
      method: 'get',
      options: {
        default: 'default value'
      },
      onResponse() {
        expect(this.data).toBe('default value');
      }
    });
    expect(errorMessage).toBe('errorWork');
    expect(status).toBe(403);
  });
});
