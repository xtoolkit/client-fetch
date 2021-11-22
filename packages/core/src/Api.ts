import type {Request, RequestInput} from './Request';
import type {StateBuilder} from './State';
import {method as manualMethod} from './methods/manual';
import {method as graphqlMethod, ApiInputGraphQL} from './methods/graphql';
import {Xetch, Response} from './Xetch';
import {cloneValue} from './utils';

export interface ApiOptions {
  default?: Partial<RequestInput>;
  graphql?: {
    clients?: Record<string, string>;
  };
}

type ApiExecuteMode = 'run' | 'promise';

interface ApiInputOnly<Input = any>
  extends Omit<RequestInput, 'method' | 'url'> {
  input?: Input;
}

export class Api<APP = any> {
  private app?: APP;
  initApp = false;

  constructor(
    private options: ApiOptions,
    private stateBuilder: StateBuilder,
    private request: Request
  ) {}

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

  private execute(mode: ApiExecuteMode, method: any, input: any) {
    const render = this.renderApiInput(method, input);
    const xetch = new Xetch(this.request, this.stateBuilder, {
      default: this.options.default || {},
      method: render.method,
      input: render.input
    });
    return xetch.gate(mode === 'promise');
  }

  run<Fn extends (args: any) => any>(
    method: Fn,
    input?: ApiInputOnly<Parameters<Fn>[0]>
  ): Response;
  run(method: 'manual', input: RequestInput): Response;
  run(
    method: 'graphql' | `graphql:${string}`,
    input: ApiInputGraphQL
  ): Response;
  run(method: any, input: any) {
    return this.execute('run', method, input) as Response;
  }

  promise<Fn extends (args: any) => any>(
    method: Fn,
    input?: ApiInputOnly<Parameters<Fn>[0]>
  ): Promise<Response>;
  promise(method: 'manual', input: RequestInput): Promise<Response>;
  promise(
    method: 'graphql' | `graphql:${string}`,
    input: ApiInputGraphQL
  ): Promise<Response>;
  promise(method: any, input: any) {
    return this.execute('promise', method, input) as Promise<Response>;
  }

  /* istanbul ignore next */
  static createRes() {
    return Xetch.createRes();
  }
}
