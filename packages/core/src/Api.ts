import type {Request, RequestInput} from './Request';
import {method as manualMethod} from './methods/manual';
import {method as graphqlMethod, ApiInputGraphQL} from './methods/graphql';
import {Xetch} from './Xetch';
import {cloneValue} from './utils';

export interface ApiOptions {
  default?: Partial<RequestInput>;
  graphql?: {
    clients?: Record<string, string>;
  };
}

interface ApiInputOnly<Input = any>
  extends Omit<RequestInput, 'method' | 'url'> {
  input?: Input;
}

export type ExecuteMethod = (args: any) => RequestInput;

export type ExecutesArgs<Fn extends ExecuteMethod | undefined = undefined> =
  Fn extends ExecuteMethod
    ? [method: Fn, input?: ApiInputOnly<Parameters<Fn>[0]>]
    :
        | [method: 'manual', input: RequestInput]
        | [method: 'graphql' | `graphql:${string}`, input: ApiInputGraphQL];

export class Api<APP = any> {
  private app?: APP;
  initApp = false;

  constructor(private options: ApiOptions, private request: Request) {}

  setApp(app: APP) {
    if (!this.initApp) {
      this.app = app;
      this.initApp = true;
    }
  }

  private renderApiInput(requestMethod: any, input: any) {
    let clone = cloneValue(input);
    let method = requestMethod;
    let methodInput = clone.input;
    if (typeof requestMethod === 'string') {
      if (requestMethod === 'manual') {
        method = manualMethod;
        methodInput = clone;
        clone = {};
      } else if (/^graphql[/:]/.test(requestMethod)) {
        methodInput.client = requestMethod.replace(/^graphql[/:]/, '');
        requestMethod = 'graphql';
      }
      if (requestMethod === 'graphql') {
        method = graphqlMethod;
        methodInput.clients = this.options.graphql?.clients || {};
      }
    }
    delete clone.method;
    delete clone.input;
    return {
      method: method.apply(this.app, [methodInput]),
      input: clone
    };
  }

  execute<Fn extends ExecuteMethod | undefined = undefined>(
    ...[method, input]: ExecutesArgs<Fn>
  ) {
    const render = this.renderApiInput(method, input);
    return new Xetch(this.request, {
      default: this.options.default || {},
      method: render.method,
      input: render.input
    }).gate();
  }

  /* istanbul ignore next */
  static createRes() {
    return Xetch.createRes();
  }
}
