import {apiBuilder, gql} from '../helper';
describe('Request test', () => {
  const graphqlOptions = {
    clients: {
      common: '/api/common',
      elastic: '/api/elastic'
    }
  };
  const query = gql`query {}`;
  const variables = {
    test: 9
  };
  const operation = 'posts';
  const api = apiBuilder({graphql: graphqlOptions});
  it('basic', () => {
    api.run('graphql', {
      input: {query, variables, operation},
      onRequest() {
        expect(this.data).toMatchObject({
          query,
          variables,
          operationName: operation
        });
      }
    });
  });

  it('use default client', () => {
    api.run('graphql', {
      input: {query, variables, operation},
      onRequest() {
        expect(this.url).toBe(graphqlOptions.clients.common);
      }
    });
  });

  it('use other client', () => {
    api.run('graphql:elastic', {
      input: {query, variables, operation},
      onRequest() {
        expect(this.url).toBe(graphqlOptions.clients.elastic);
      }
    });
  });

  it('not define clients list', () => {
    const api2 = apiBuilder({});
    api2.run('graphql:custom', {
      input: {query},
      onRequest() {
        expect(this.url).toBe('custom');
      }
    });
  });
});
