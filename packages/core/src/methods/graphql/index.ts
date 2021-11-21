import type {RequestInput} from '../../Request';
export {tagFix as gql} from './tagFix';

interface GraphQLMethodInput {
  query: string;
  variables?: Record<string, any>;
  operation?: string;
  client?: string;
  clients?: Record<string, string>;
}

export type ApiInputGraphQL = {
  input: GraphQLMethodInput;
} & Omit<RequestInput, 'method' | 'url'>;

export function method(input: GraphQLMethodInput): RequestInput {
  let url = '';
  if (input.clients) {
    const clientsName = Object.keys(input.clients);
    if (clientsName.length > 0) {
      if (!input.client || input.client === '') {
        url = input.clients[clientsName[0]];
      } else if (input.clients[input.client]) {
        url = input.clients[input.client];
      }
    } else if (input.client) {
      url = input.client;
    }
  }

  return {
    url,
    method: 'post',
    data: {
      operationName: input.operation || null,
      variables: input.variables || {},
      query: input.query
    }
  };
}
