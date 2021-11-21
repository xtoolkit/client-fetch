import type {ApiState} from './Api';
import type {RequestInputHooks, RequestInput, Request} from './Request';
import {cloneValue, deepMergeObject} from './utils';

interface ResponseTools {
  update: (input: RequestInput) => Promise<Response>;
  $update: (input: RequestInput) => Response;
  refresh: () => Promise<Response>;
  $refresh: () => Response;
  pagination: {
    appending: boolean;
    page: number;
    getPage: () => Promise<Response>;
    append: () => Promise<Response>;
    next: () => Promise<Response>;
    prev: () => Promise<Response>;
    $getPage: () => Response;
    $append: () => Response;
    $next: () => Response;
    $prev: () => Response;
  };
}

export type Response = ReturnType<typeof Xetch['createRes']> &
  Partial<ResponseTools>;

interface XetchRequestInputs {
  default: Partial<RequestInput>;
  method: RequestInput;
  input: Partial<RequestInput>;
}

export class Xetch {
  private hooks = {
    onUploadProgress: [] as RequestInputHooks['onUploadProgress'][],
    onDownloadProgress: [] as RequestInputHooks['onDownloadProgress'][],
    onResponse: [] as RequestInputHooks['onResponse'][],
    onCancel: [] as RequestInputHooks['onCancel'][],
    onTimeout: [] as RequestInputHooks['onTimeout'][],
    onRequest: [] as RequestInputHooks['onRequest'][],
    onError: [] as RequestInputHooks['onError'][]
  };
  private _state: any;
  private config: RequestInput;

  constructor(
    private request: Request,
    private stateManager: ApiState,
    requestInputs: XetchRequestInputs
  ) {
    this._state = stateManager.createState(Xetch.createRes());
    this.config = deepMergeObject(
      deepMergeObject(
        this.extractHooks(requestInputs.default),
        this.extractHooks(requestInputs.method)
      ),
      this.extractHooks(requestInputs.input)
    );
  }

  private extractHooks(input: Partial<RequestInput>) {
    const clone = cloneValue(input);
    (Object.keys(this.hooks) as (keyof Xetch['hooks'])[]).forEach(hook => {
      if (clone[hook]) {
        this.hooks[hook].push(clone[hook]);
        delete clone[hook];
      }
    });
    return clone;
  }

  private invokeXetchHooks(hook: keyof RequestInputHooks, data: any) {
    if (hook === 'onResponse') {
      this.state.status = data.status;
      this.state.data = data.data;
      this.state.loading = false;
    }
    if (hook === 'onError') {
      this.state.loading = false;
      this.state.error = true;
      if (data.response) {
        this.state.status = data.response.status;
        this.state.errorMessage = data.response.message;
      } else {
        this.state.errorMessage = data.message;
      }
    }
  }

  private invokeHook(hook: keyof RequestInputHooks) {
    return (data: any) => {
      this.invokeXetchHooks(hook, data);
      this.hooks[hook].forEach(fn => {
        (fn as any).apply(hook === 'onRequest' ? this.config : this.state, [
          data
        ]);
      });
    };
  }

  gate(isPromise: boolean) {
    if (this.state.data === null && this.config.options?.default) {
      this.state.data = this.config.options.default;
    }
    const {cancel, gate} = this.request({
      ...this.config,
      onUploadProgress: this.invokeHook('onUploadProgress'),
      onDownloadProgress: this.invokeHook('onDownloadProgress'),
      onResponse: this.invokeHook('onResponse'),
      onError: this.invokeHook('onError'),
      onCancel: this.invokeHook('onCancel'),
      onRequest: this.invokeHook('onRequest'),
      onTimeout: this.invokeHook('onTimeout')
    });
    this.state.cancel = cancel;
    return isPromise
      ? (gate.then(() => this.state) as unknown as Promise<Response>)
      : this.state;
  }

  get state() {
    return this.stateManager.getState<Response>(this._state);
  }

  /* istanbul ignore next */
  static createRes() {
    return {
      data: null,
      loading: true,
      error: false,
      errorMessage: null,
      status: -1,
      cancel: () => {}
    };
  }
}
