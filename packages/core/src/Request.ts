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

type RequestHookCallbackWithThis<THIS = Response> = (
  this: THIS,
  data?: any
) => void;

type RequestHookCallback = (data?: any) => void;

export interface RequestInputHooks {
  onUploadProgress: RequestHookCallbackWithThis;
  onDownloadProgress: RequestHookCallbackWithThis;
  onResponse: RequestHookCallbackWithThis;
  onError: RequestHookCallbackWithThis;
  onRequest: RequestHookCallbackWithThis<RequestInput>;
  onCancel: RequestHookCallbackWithThis;
  onTimeout: RequestHookCallbackWithThis;
}

interface RequestHooks {
  onUploadProgress: RequestHookCallback;
  onDownloadProgress: RequestHookCallback;
  onResponse: RequestHookCallback;
  onError: RequestHookCallback;
  onRequest: RequestHookCallback;
  onCancel: RequestHookCallback;
  onTimeout: RequestHookCallback;
}

export interface RequestInput extends Partial<RequestInputHooks> {
  // origin
  url: string;
  method: RequestMethod;
  params?:
    | string
    | string[][]
    | Record<string, string | number | boolean | null>
    | URLSearchParams;
  data?: any;
  headers?: Record<string, string>;

  // options
  options?: {
    timeout?: number;
    credentials?: boolean;
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
  input: Omit<RequestInput, keyof RequestInputHooks> & RequestHooks
) => CreateRequest;
