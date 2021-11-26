import type {Response} from './Xetch';

type RequestMethod =
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'
  | 'purge'
  | 'link'
  | 'unlink';

type RequestHookCallback<THIS> = (this: THIS, data?: any) => void;

export interface RequestInputHooks<THIS = Response> {
  onUploadProgress: RequestHookCallback<THIS>;
  onDownloadProgress: RequestHookCallback<THIS>;
  onResponse: RequestHookCallback<THIS>;
  onError: RequestHookCallback<THIS>;
  onRequest: RequestHookCallback<THIS extends Response ? RequestInput : THIS>;
  onCancel: RequestHookCallback<THIS>;
  onTimeout: RequestHookCallback<THIS>;
  onEach?: RequestHookCallback<THIS>;
}

export interface RequestInput extends Partial<RequestInputHooks> {
  // origin
  url: string;
  method: RequestMethod;
  params?: Record<string, string | number | boolean | null>;
  data?: any;
  headers?: Record<string, string>;

  // options
  options?: {
    timeout?: number;
    credentials?: 'include' | 'omit' | 'same-origin';
    auth?: {
      username: string;
      password: string;
    };

    // helper
    default?: any;
  };
}

interface CreateRequest {
  cancel: (msg?: string) => void;
  gate: Promise<void>;
}

export type Request = (
  input: Omit<RequestInput & RequestInputHooks<any>, 'onEach'>
) => CreateRequest;
