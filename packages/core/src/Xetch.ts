import {cloneValue, deepMergeObject} from './utils';
import type {RequestInputHooks, RequestInput, Request} from './Request';

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
    onError: [] as RequestInputHooks['onError'][],
    onEach: [] as Required<RequestInputHooks>['onEach'][]
  };
  private state: Response;
  private config: RequestInput;

  constructor(private request: Request, requestInputs: XetchRequestInputs) {
    this.state = Xetch.createRes();
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

  private invokeXetchHooks(hook: keyof RequestInputHooks, res: any) {
    if (hook === 'onResponse') {
      this.state.status = res.status;
      this.state.data = res.data;
      this.state.loading = false;
    }
    if (hook === 'onError') {
      this.state.loading = false;
      this.state.error = true;
      if (res.status) {
        this.state.status = res.status;
      }
      this.state.errorMessage = res.data;
    }
  }

  /* istanbul ignore next */
  private invokeHook(hook: keyof RequestInputHooks) {
    return (data: any) => {
      this.invokeXetchHooks(hook, data);
      this.hooks[hook].forEach(fn => {
        (fn as any).apply(hook === 'onRequest' ? this.config : this.state, [
          data
        ]);
      });
      this.hooks.onEach.forEach(fn => {
        fn.apply(this.state);
      });
    };
  }

  gate() {
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
    return gate.then(() => this.state);
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
