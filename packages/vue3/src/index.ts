import {Api} from '@client-fetch/core';
import {Mixin} from './mixin';
import {useApi} from './inject/api';
import {useRunApi} from './inject/run';
import {usePromiseApi} from './inject/promise';
import type {App, Plugin} from 'vue';
import type {Request, ApiOptions} from '@client-fetch/core';
import type {_ApiObjectInput} from './mixin';

export {useRunApi, usePromiseApi, useApi};

export const install: Plugin = (
  app: App,
  request: Request,
  options?: ApiOptions
) => {
  const api = new Api<App>(options || {}, request);
  api.setApp(app);
  app.provide('client-fetch', api);
  app.mixin(Mixin);
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
    api?: _ApiObjectInput;
  }

  export interface ComponentCustomProperties {
    $api: {
      execute: Api['execute'];
      run: typeof useRunApi;
      promise: typeof usePromiseApi;
    };
  }
}
