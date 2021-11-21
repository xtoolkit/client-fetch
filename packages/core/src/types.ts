import {ApiInputGraphQL} from './methods/graphql';
import type {RequestInput} from './Request';

type GraphQLApiOptionInput = {
  method: 'graphql' | `graphql:${string}`;
} & ApiInputGraphQL;

type ManualApiOptionInput = {
  manual: true;
} & RequestInput;

type FnApiOptionInput = {
  method: Function;
  input?: any;
} & Omit<RequestInput, 'method' | 'url'>;

export type ApiObjectInput =
  | FnApiOptionInput
  | GraphQLApiOptionInput
  | ManualApiOptionInput;

// const x: ApiObjectInput = {
//   method: 'graphql',
//   input: {}
// };

// export {x};
